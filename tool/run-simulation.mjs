import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEST_MODE = process.argv.includes('--test');
const allowedArgs = new Set(['--test']);
if (process.argv.slice(2).some((argument) => !allowedArgs.has(argument))) {
  throw new Error('Usage: node tool/run-simulation.mjs [--test]');
}

const API_URL = 'http://127.0.0.1:4174';
const WEB_URL = 'http://127.0.0.1:5173';
const instanceId = randomUUID();
const setupToken = TEST_MODE ? 'jovexa-simulation-test-token' : undefined;
const temporaryDirectory = TEST_MODE
  ? await mkdtemp(path.join(os.tmpdir(), 'jovexa-simulation-'))
  : null;
const children = [];
let shuttingDown = false;
let signalExitCode;

function startProcess(label, executable, args, env) {
  const child = spawn(executable, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: 'inherit',
    shell: false,
  });
  child.label = label;
  child.exitResult = new Promise((resolve) => {
    child.once('error', (error) => resolve({ error }));
    child.once('exit', (code, signal) => resolve({ code, signal }));
  });
  children.push(child);
  return child;
}

async function waitForUrl(child, url, isReady) {
  const deadline = Date.now() + 20000;
  let lastError;
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode !== null) {
      const result = await child.exitResult;
      throw new Error(`${child.label} exited before becoming ready: ${JSON.stringify(result)}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok && await isReady(response)) return;
      lastError = new Error(`Unexpected readiness response: ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`${child.label} did not become ready in time: ${lastError?.message || 'no response'}`);
}

function waitForSignal() {
  return new Promise((resolve) => {
    process.once('SIGINT', () => {
      signalExitCode = 130;
      resolve();
    });
    process.once('SIGTERM', () => {
      signalExitCode = 143;
      resolve();
    });
  });
}

async function stopProcess(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill('SIGTERM');
  await Promise.race([
    child.exitResult,
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  if (child.exitCode === null && child.signalCode === null) child.kill();
}

async function main() {
  const serverEnv = {
    JOVEXA_SIMULATION: 'true',
    JOVEXA_SIMULATION_INSTANCE: instanceId,
    ...(setupToken ? { JOVEXA_SETUP_TOKEN: setupToken } : {}),
    ...(temporaryDirectory
      ? { JOVEXA_SIMULATION_DATA: path.join(temporaryDirectory, 'state.json') }
      : {}),
  };
  const api = startProcess('Simulation API', process.execPath, ['tool/simulation-server.mjs'], serverEnv);
  await waitForUrl(api, `${API_URL}/api/health`, async (response) => {
    const health = await response.json();
    return health.instanceId === instanceId && health.mode === 'local-simulation';
  });

  const vite = startProcess('Vite development server', process.execPath, [
    'node_modules/vite/bin/vite.js',
    '--host',
    '127.0.0.1',
    '--port',
    '5173',
    '--strictPort',
  ], { VITE_JOVEXA_SIMULATION: 'true' });
  await waitForUrl(vite, WEB_URL, async (response) => response.ok);

  if (TEST_MODE) {
    const playwrightCli = path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js');
    const tests = startProcess('Simulation browser tests', process.execPath, [
      playwrightCli,
      'test',
      'e2e/simulation.spec.js',
    ], {
      STATIC_BASE_URL: WEB_URL,
      JOVEXA_TEST_SETUP_TOKEN: setupToken,
      JOVEXA_SIMULATION_E2E: 'true',
    });
    const result = await Promise.race([tests.exitResult, waitForSignal()]);
    if (signalExitCode !== undefined) return signalExitCode;
    if (result.error) throw result.error;
    return result.code ?? 1;
  }

  console.log(`Local simulation website: ${WEB_URL}`);
  console.log(`Local simulation admin:   ${WEB_URL}/admin`);
  console.log('Press Ctrl+C to stop both local processes.');
  const result = await Promise.race([
    waitForSignal().then(() => signalExitCode),
    api.exitResult.then((exit) => {
      if (!shuttingDown) throw new Error(`Simulation API stopped unexpectedly: ${JSON.stringify(exit)}`);
    }),
    vite.exitResult.then((exit) => {
      if (!shuttingDown) throw new Error(`Vite stopped unexpectedly: ${JSON.stringify(exit)}`);
    }),
  ]);
  return result ?? 1;
}

let exitCode = 1;
try {
  exitCode = await main();
} catch (error) {
  console.error(error);
} finally {
  shuttingDown = true;
  for (const child of [...children].reverse()) await stopProcess(child);
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
  process.exitCode = signalExitCode ?? exitCode;
}
