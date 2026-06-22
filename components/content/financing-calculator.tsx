'use client';

import { useMemo, useState } from 'react';
import { financingContent } from '@/config/site-content';
import {
  calculateDownPayment,
  calculateFinancedAmount,
  calculateMonthlyPayment,
  clampPrice,
  formatCopInput,
  parseCopInput,
} from '@/lib/financing';
import { formatPriceCop } from '@/lib/vehicles';
import { FadeIn } from '@/components/motion/fade-in';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type FinancingCalculatorProps = {
  vehiclePrice: number;
  vehicleLabel?: string;
  /** En /financiacion el usuario puede editar el valor del vehículo */
  priceEditable?: boolean;
  className?: string;
};

const { calculator } = financingContent;

export function FinancingCalculator({
  vehiclePrice,
  vehicleLabel,
  priceEditable = false,
  className,
}: FinancingCalculatorProps) {
  const initialPrice = priceEditable
    ? calculator.defaultReferencePrice
    : vehiclePrice;

  const [price, setPrice] = useState(initialPrice);
  const [priceInput, setPriceInput] = useState(formatCopInput(initialPrice));
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(
    calculator.defaultDownPaymentPercent
  );
  const [months, setMonths] = useState<number>(calculator.defaultMonths);

  const effectivePrice = priceEditable ? price : vehiclePrice;

  const downPayment = useMemo(
    () => calculateDownPayment(effectivePrice, downPaymentPercent),
    [effectivePrice, downPaymentPercent]
  );

  const financed = useMemo(
    () => calculateFinancedAmount(effectivePrice, downPaymentPercent),
    [effectivePrice, downPaymentPercent]
  );

  const monthly = useMemo(
    () =>
      calculateMonthlyPayment(
        effectivePrice,
        downPaymentPercent,
        months,
        calculator.defaultAnnualRate
      ),
    [effectivePrice, downPaymentPercent, months]
  );

  function handlePriceChange(raw: string) {
    setPriceInput(raw);
    const parsed = parseCopInput(raw);
    if (parsed === 0) {
      setPrice(0);
      return;
    }
    setPrice(clampPrice(parsed, calculator.minPrice, calculator.maxPrice));
  }

  function handlePriceBlur() {
    const parsed = parseCopInput(priceInput);
    const clamped = clampPrice(
      parsed || calculator.defaultReferencePrice,
      calculator.minPrice,
      calculator.maxPrice
    );
    setPrice(clamped);
    setPriceInput(formatCopInput(clamped));
  }

  return (
    <FadeIn className={cn('rounded-md border border-border bg-surface p-4 min-[375px]:p-6 md:p-8', className)}>
      <div className="flex flex-col gap-3 min-[425px]:flex-row min-[425px]:items-start min-[425px]:justify-between min-[425px]:gap-4">
        <div>
          <h2 className="font-serif text-xl min-[375px]:text-2xl">Simula tu cuota</h2>
          {vehicleLabel && (
            <p className="mt-1 text-sm text-accent">{vehicleLabel}</p>
          )}
        </div>
        {!priceEditable && (
          <p className="price-display-sm text-foreground">
            {formatPriceCop(effectivePrice)}
          </p>
        )}
      </div>

      {priceEditable && (
        <div className="mt-6">
          <Input
            label="Valor del vehículo a financiar"
            id="financing-price"
            inputMode="numeric"
            value={priceInput}
            onChange={(e) => handlePriceChange(e.target.value)}
            onBlur={handlePriceBlur}
            placeholder={formatCopInput(calculator.defaultReferencePrice)}
            className="font-mono text-lg"
          />
          <p className="mt-2 text-xs text-muted">
            Ingresa el valor en pesos colombianos (COP). Rango referencial:{' '}
            {formatPriceCop(calculator.minPrice)} –{' '}
            {formatPriceCop(calculator.maxPrice)}.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-8">
        <SliderField
          label="Cuota inicial"
          valueLabel={`${downPaymentPercent}% · ${formatPriceCop(downPayment)}`}
          min={calculator.minDownPaymentPercent}
          max={calculator.maxDownPaymentPercent}
          step={5}
          value={downPaymentPercent}
          onChange={setDownPaymentPercent}
          disabled={effectivePrice <= 0}
        />

        <div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted">Plazo</span>
            <span className="font-mono text-sm text-foreground">{months} meses</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {calculator.monthOptions.map((option) => (
              <button
                key={option}
                type="button"
                disabled={effectivePrice <= 0}
                onClick={() => setMonths(option)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ease-out disabled:opacity-40',
                  months === option
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted hover:border-foreground hover:text-foreground'
                )}
              >
                {option}m
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 border-t border-border pt-6 min-[425px]:grid-cols-3 min-[425px]:pt-8">
        <ResultItem label="Cuota inicial" value={formatPriceCop(downPayment)} />
        <ResultItem label="Monto financiado" value={formatPriceCop(financed)} />
        <ResultItem
          label="Cuota mensual est."
          value={effectivePrice > 0 ? formatPriceCop(monthly) : '—'}
          highlight
        />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        {calculator.disclaimer}
      </p>
    </FadeIn>
  );
}

function SliderField({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
  disabled,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn(disabled && 'opacity-40')}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-mono text-sm text-foreground">{valueLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent disabled:cursor-not-allowed"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  );
}

function ResultItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(highlight && 'sm:col-span-1')}>
      <p className="text-xs uppercase tracking-[0.05em] text-muted">{label}</p>
      <p
        className={cn(
          'mt-1 font-mono',
          highlight ? 'text-xl text-accent min-[375px]:text-2xl' : 'text-base text-foreground min-[375px]:text-lg'
        )}
      >
        {value}
      </p>
    </div>
  );
}
