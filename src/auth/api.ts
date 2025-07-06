const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export async function register(email: string, password: string, metadata?: { fullName: string, username: string }) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, ...metadata })
  });
  return res.json();
}

export async function login(identifier: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  return res.json();
}
