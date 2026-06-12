'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { saveVehicle } from '@/lib/actions/vehicles';
import type { Vehicle } from '@/types/database';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getFuelLabel, getStatusLabel, getTransmissionLabel } from '@/lib/labels';

type VehicleFormProps = {
  vehicle?: Vehicle;
};

const selectClass =
  'h-11 w-full rounded-sm border border-border bg-surface px-4 text-sm text-foreground transition-colors duration-200 ease-out focus:border-foreground focus:outline-none';

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>();

  const existingCount =
    (vehicle?.vehicle_images?.length ?? 0) - deletedIds.length;

  useEffect(() => {
    if (saved && savedId && !vehicle) {
      router.push(`/admin/vehiculos/${savedId}`);
      router.refresh();
    }
  }, [saved, savedId, vehicle, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    setSaved(false);

    const formData = new FormData(e.currentTarget);
    formData.set('deleted_images', JSON.stringify(deletedIds));
    formData.set('existing_image_count', String(Math.max(0, existingCount)));
    newFiles.forEach((file) => formData.append('images', file));

    const result = await saveVehicle({ success: false }, formData);

    if (result.success) {
      setSaved(true);
      setSavedId(result.vehicleId);
      if (vehicle) router.refresh();
    } else {
      setError(result.error ?? 'Error al guardar');
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {vehicle && (
        <input type="hidden" name="vehicle_id" value={vehicle.id} />
      )}

      <section className="space-y-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
          Información básica
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Marca"
            name="brand"
            required
            defaultValue={vehicle?.brand}
            placeholder="Ej. BMW"
            disabled={pending}
          />
          <Input
            label="Modelo"
            name="model"
            required
            defaultValue={vehicle?.model}
            placeholder="Ej. X3 xDrive30i"
            disabled={pending}
          />
          <Input
            label="Año"
            name="year"
            type="number"
            required
            min={1990}
            max={2030}
            defaultValue={vehicle?.year}
            disabled={pending}
          />
          <Input
            label="Color"
            name="color"
            required
            defaultValue={vehicle?.color}
            placeholder="Ej. Blanco Alpino"
            disabled={pending}
          />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
          Precio y estado
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Precio (COP)"
            name="price_cop"
            type="number"
            required
            min={1}
            defaultValue={vehicle?.price_cop}
            placeholder="245000000"
            disabled={pending}
          />
          <Input
            label="Kilometraje"
            name="mileage_km"
            type="number"
            required
            min={0}
            defaultValue={vehicle?.mileage_km}
            placeholder="28000"
            disabled={pending}
          />
          <FormSelect
            label="Combustible"
            name="fuel_type"
            defaultValue={vehicle?.fuel_type ?? 'gasolina'}
            options={['gasolina', 'diesel', 'hibrido', 'electrico', 'gas']}
            getLabel={getFuelLabel}
            disabled={pending}
          />
          <FormSelect
            label="Transmisión"
            name="transmission"
            defaultValue={vehicle?.transmission ?? 'automatica'}
            options={['manual', 'automatica', 'cvt']}
            getLabel={getTransmissionLabel}
            disabled={pending}
          />
          <FormSelect
            label="Estado"
            name="status"
            defaultValue={vehicle?.status ?? 'disponible'}
            options={['disponible', 'reservado', 'vendido']}
            getLabel={getStatusLabel}
            disabled={pending}
          />
          <div className="space-y-2">
            <span className="block text-sm text-foreground">Opciones</span>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted">
              <input
                type="checkbox"
                name="featured"
                value="true"
                defaultChecked={vehicle?.featured}
                disabled={pending}
                className="h-4 w-4 rounded-sm border-border accent-foreground"
              />
              Mostrar en página principal
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
          Descripción
        </h2>
        <Textarea
          label="Descripción del vehículo"
          name="description"
          defaultValue={vehicle?.description}
          placeholder="Describe el estado, equipamiento y detalles relevantes..."
          disabled={pending}
        />
      </section>

      <section className="space-y-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
          Fotos
        </h2>
        <ImageUpload
          existingImages={vehicle?.vehicle_images ?? []}
          onDeletedChange={setDeletedIds}
          onNewFilesChange={setNewFiles}
        />
      </section>

      {error && (
        <p className="text-sm text-[var(--status-sold-text)]" role="alert">
          {error}
        </p>
      )}

      {saved && vehicle && (
        <p className="text-sm text-[var(--status-available-text)]">
          Cambios guardados correctamente.
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando...' : 'Guardar y publicar'}
        </Button>
        {vehicle && (
          <>
            <Button
              href={`/admin/vehiculos/${vehicle.id}/preview`}
              variant="outline"
            >
              Ver vista previa
            </Button>
            <Button href={`/catalogo/${vehicle.slug}`} variant="ghost">
              Ver en el sitio
            </Button>
          </>
        )}
        <Button href="/admin/vehiculos" variant="ghost">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function FormSelect<T extends string>({
  label,
  name,
  defaultValue,
  options,
  getLabel,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue: T;
  options: T[];
  getLabel: (value: T) => string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm text-foreground">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className={selectClass}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {getLabel(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
