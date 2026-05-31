const BASE = 'http://localhost:3001';

async function req(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  get: (path: string) => req(path),
  post: (path: string, body: unknown) => req(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: unknown) => req(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path: string) => req(path, { method: 'DELETE' }),
};
