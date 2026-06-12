'use client';

import { useState } from 'react';
import { signInAdmin } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError('');
    const result = await signInAdmin(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="admin@autodemo.co"
        disabled={pending}
      />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        disabled={pending}
      />

      {error && (
        <p className="text-sm text-[var(--status-sold-text)]" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
}
