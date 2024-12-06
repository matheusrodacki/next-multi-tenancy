import { saveSession } from '@/utils/session';

export async function loginAction(formData: FormData) {
  'use server';
  const { email, password } = Object.fromEntries(formData.entries());

  const response = await fetch('https://api.mrrodz.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { accessToken } = await response.json();
    await saveSession(accessToken);
  } else {
    const responseText = await response.text();
    console.error('Failed to login', responseText);
  }
}

export function LoginPage() {
  return (
    <form className="m-4" action={loginAction}>
      <h1 className="text-2xl font-bold">Login</h1>
      <div>
        <label className="block">E-mail</label>
        <input type="text" name="email" className="border p-2 w-full" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" className="border p-2 w-full" />
      </div>
      <button className="bg-blue-500 text-white p-4 mt-2">Login</button>
    </form>
  );
}

export default LoginPage;
