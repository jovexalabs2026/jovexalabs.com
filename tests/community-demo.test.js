import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyDemo, parseDemo, demoBalance, sessionRemaining, updateDemo,
  claimedToday, SESSION_MS, SESSION_POINTS } from '../src/lib/community-demo.js';

const now = Date.UTC(2026, 9, 24, 12);

test('demo starts empty with no fabricated users, balances or financial data', () => {
  assert.deepEqual(parseDemo(null), emptyDemo());
  assert.equal(demoBalance(emptyDemo()), 0);
  assert.equal(sessionRemaining(emptyDemo(), now), 0);
});

test('session claims require full elapsed time and can only be applied once', () => {
  const active = updateDemo(emptyDemo(), { type: 'start' }, now);
  assert.equal(sessionRemaining(active, now), SESSION_MS);
  assert.equal(sessionRemaining(active, now + 15000), 45000);
  assert.throws(() => updateDemo(active, { type: 'start' }, now), /current demo session/);
  assert.throws(() => updateDemo(active, { type: 'claim-session' }, now + SESSION_MS - 1), /not complete/);
  const claimed = updateDemo(active, { type: 'claim-session' }, now + SESSION_MS);
  assert.equal(demoBalance(claimed), SESSION_POINTS);
  assert.equal(claimed.startedAt, null);
  assert.throws(() => updateDemo(claimed, { type: 'claim-session' }, now + SESSION_MS), /Start/);
});

test('elapsed sessions survive serialization and do not accrue unbounded passive rewards', () => {
  const active = updateDemo(emptyDemo(), { type: 'start' }, now);
  const restored = parseDemo(JSON.stringify(active));
  const claimed = updateDemo(restored, { type: 'claim-session' }, now + 20 * SESSION_MS);
  assert.equal(demoBalance(claimed), SESSION_POINTS);
});

test('clock rollback cannot finish a session', () => {
  const active = updateDemo(emptyDemo(), { type: 'start' }, now);
  assert.throws(() => sessionRemaining(active, now - 1), /clock moved backwards/);
  assert.throws(() => updateDemo(active, { type: 'claim-session' }, now - 1), /clock moved backwards/);
  assert.throws(() => updateDemo(emptyDemo(), { type: 'start' }, NaN), /clock is invalid/);
});

test('daily tasks require self-report, reject duplicates and reset at UTC midnight', () => {
  const midnight = Date.UTC(2026, 9, 25);
  assert.throws(() => updateDemo(emptyDemo(), { type: 'claim-task', id: 'learn' }, now), /Confirm/);
  assert.throws(() => updateDemo(emptyDemo(), { type: 'claim-task', id: '__proto__', confirmed: true }, now), /does not exist/);
  const first = updateDemo(emptyDemo(), { type: 'claim-task', id: 'learn', confirmed: true }, midnight - 1);
  assert.equal(demoBalance(first), 10);
  assert.throws(() => updateDemo(first, { type: 'claim-task', id: 'learn', confirmed: true }, midnight - 1), /already claimed/);
  assert.deepEqual(claimedToday(first, midnight), []);
  const second = updateDemo(first, { type: 'claim-task', id: 'learn', confirmed: true }, midnight);
  assert.equal(demoBalance(second), 20);
  assert.deepEqual(claimedToday(second, midnight), ['learn']);
});

test('invalid saved state is rejected instead of producing a success-shaped balance', () => {
  for (const raw of ['{bad json', 'null', '[]', '{"version":2}',
    JSON.stringify({ ...emptyDemo(), sessionsCompleted: -1 }),
    JSON.stringify({ ...emptyDemo(), sessionsCompleted: 1.5 }),
    JSON.stringify({ ...emptyDemo(), taskPoints: 1e20 }),
    JSON.stringify({ ...emptyDemo(), startedAt: 'yesterday' }),
    JSON.stringify({ ...emptyDemo(), claimedTasks: ['learn', 'learn'] }),
    JSON.stringify({ ...emptyDemo(), claimedTasks: ['constructor'] })]) {
    assert.throws(() => parseDemo(raw));
  }
  assert.throws(() => updateDemo(emptyDemo(), { type: 'send-money' }, now), /Unknown demo action/);
});
