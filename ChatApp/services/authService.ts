interface LoginCredentials {
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function login({ email, password }: LoginCredentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return { success: true, token: data.token };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function validateToken(token: string) {
  try {
    const response = await fetch(`${API_URL}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
}
