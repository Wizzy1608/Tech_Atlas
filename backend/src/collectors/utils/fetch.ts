// Every source call gets a hard deadline; a silent host must not stall the run.
const TIMEOUT_MS = 15_000;

export function fetchTimed(url: string, init: RequestInit = {}) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
}
