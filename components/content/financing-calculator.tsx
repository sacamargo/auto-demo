'use client';

import { useMemo, useState } from 'react';
import { financingContent } from '@/config/site-content';
import {
  calculateDownPayment,
  calculateFinancedAmount,
  calculateMonthlyPayment,
} from '@/lib/financing';
import { formatPriceCop } from '@/lib/vehicles';
import { FadeIn } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

type FinancingCalculatorProps = {
  vehiclePrice: number;
  vehicleLabel?: string;
  className?: string;
};

const { calculator } = financingContent;

export function FinancingCalculator({
  vehiclePrice,
  vehicleLabel,
  className,
}: FinancingCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(
    calculator.defaultDownPaymentPercent
  );
  const [months, setMonths] = useState<number>(calculator.defaultMonths);

  const downPayment = useMemo(
    () => calculateDownPayment(vehiclePrice, downPaymentPercent),
    [vehiclePrice, downPaymentPercent]
  );

  const financed = useMemo(
    () => calculateFinancedAmount(vehiclePrice, downPaymentPercent),
    [vehiclePrice, downPaymentPercent]
  );

  const monthly = useMemo(
    () =>
      calculateMonthlyPayment(
        vehiclePrice,
        downPaymentPercent,
        months,
        calculator.defaultAnnualRate
      ),
    [vehiclePrice, downPaymentPercent, months]
  );

  return (
    <FadeIn className={cn('rounded-md border border-border bg-surface p-6 md:p-8', className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl">Simula tu cuota</h2>
          {vehicleLabel && (
            <p className="mt-1 text-sm text-accent">{vehicleLabel}</p>
          )}
        </div>
        <p className="font-mono text-xl text-foreground md:text-2xl">
          {formatPriceCop(vehiclePrice)}
        </p>
      </div>

      <div className="mt-8 space-y-8">
        <SliderField
          label="Cuota inicial"
          valueLabel={`${downPaymentPercent}% · ${formatPriceCop(downPayment)}`}
          min={calculator.minDownPaymentPercent}
          max={calculator.maxDownPaymentPercent}
          step={5}
          value={downPaymentPercent}
          onChange={setDownPaymentPercent}
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
                onClick={() => setMonths(option)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ease-out',
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

      <div className="mt-8 grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
        <ResultItem label="Cuota inicial" value={formatPriceCop(downPayment)} />
        <ResultItem label="Monto financiado" value={formatPriceCop(financed)} />
        <ResultItem
          label="Cuota mensual est."
          value={formatPriceCop(monthly)}
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
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
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
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
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
          highlight ? 'text-2xl text-accent' : 'text-lg text-foreground'
        )}
      >
        {value}
      </p>
    </div>
  );
}
