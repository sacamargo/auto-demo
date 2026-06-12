'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type QuoteFormProps = {
  vehicleId?: string;
  vehicleInterest?: string;
  className?: string;
};

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function QuoteForm({
  vehicleId,
  vehicleInterest,
  className,
}: QuoteFormProps) {
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('loading');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!privacyAccepted) {
      setState('error');
      setErrorMessage('Debes aceptar la Política de privacidad');
      return;
    }

    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      message: formData.get('message') || '',
      vehicle_id: vehicleId ?? null,
      vehicle_interest: vehicleInterest ?? '',
      privacy_accepted: true,
    };

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setState('error');
        setErrorMessage(data.error ?? 'No pudimos enviar tu solicitud');
        return;
      }

      setState('success');
      form.reset();
      setPrivacyAccepted(false);
    } catch {
      setState('error');
      setErrorMessage('Error de conexión. Verifica tu internet e intenta de nuevo.');
    }
  }

  if (state === 'success') {
    return (
      <div
        className={cn(
          'rounded-md border border-border bg-surface p-8 text-center',
          className
        )}
      >
        <p className="font-serif text-xl text-foreground">
          Recibimos tu solicitud
        </p>
        <p className="mt-2 text-sm text-muted">
          Te contactaremos pronto con la información solicitada.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-6"
          onClick={() => setState('idle')}
        >
          Enviar otra consulta
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)} noValidate>
      {vehicleInterest && (
        <div className="rounded-sm border border-border bg-background px-4 py-3 text-sm">
          <span className="text-muted">Vehículo de interés: </span>
          <span className="text-foreground">{vehicleInterest}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Nombre completo"
          name="name"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          disabled={state === 'loading'}
        />
        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="300 123 4567"
          disabled={state === 'loading'}
        />
      </div>

      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="tu@correo.com"
        disabled={state === 'loading'}
      />

      <Textarea
        label="Mensaje (opcional)"
        name="message"
        placeholder="Cuéntanos qué buscas o si tienes alguna pregunta..."
        disabled={state === 'loading'}
      />

      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          disabled={state === 'loading'}
          className="mt-0.5 h-4 w-4 rounded-sm border-border accent-foreground"
          required
        />
        <span className="text-muted">
          He leído y acepto la{' '}
          <Link
            href="/politica-de-privacidad"
            className="text-foreground underline underline-offset-2 transition-colors duration-200 ease-out hover:text-accent"
            target="_blank"
          >
            Política de privacidad
          </Link>
        </span>
      </label>

      {state === 'error' && errorMessage && (
        <p className="text-sm text-[var(--status-sold-text)]" role="alert">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === 'loading'}>
        {state === 'loading' ? 'Enviando...' : 'Enviar solicitud'}
      </Button>
    </form>
  );
}
