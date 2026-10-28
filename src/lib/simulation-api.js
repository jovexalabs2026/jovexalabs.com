export const simulationEnabled = import.meta.env.VITE_JOVEXA_SIMULATION === 'true';

export async function simulationRequest(path, { method = 'GET', body, csrfToken, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

  const response = await fetch(path, {
    method,
    headers,
    credentials: 'same-origin',
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`Simulation service returned an unreadable response (${response.status}).`);
  }
  if (!response.ok) throw new Error(result.error || `Simulation service returned ${response.status}.`);
  return result;
}
