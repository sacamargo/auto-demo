/**
 * Cuota mensual estimada (sistema francés / amortización constante).
 * annualRate: tasa nominal anual en decimal (ej. 0.18 = 18%)
 */
export function calculateMonthlyPayment(
  priceCop: number,
  downPaymentPercent: number,
  months: number,
  annualRate: number
): number {
  if (priceCop <= 0 || months <= 0) return 0;

  const downPayment = priceCop * (downPaymentPercent / 100);
  const principal = Math.max(priceCop - downPayment, 0);

  if (principal <= 0) return 0;

  const monthlyRate = annualRate / 12;

  if (monthlyRate <= 0) {
    return Math.round(principal / months);
  }

  const factor = Math.pow(1 + monthlyRate, months);
  const payment = (principal * monthlyRate * factor) / (factor - 1);

  return Math.round(payment);
}

export function calculateDownPayment(
  priceCop: number,
  downPaymentPercent: number
): number {
  return Math.round(priceCop * (downPaymentPercent / 100));
}

export function calculateFinancedAmount(
  priceCop: number,
  downPaymentPercent: number
): number {
  return Math.max(priceCop - calculateDownPayment(priceCop, downPaymentPercent), 0);
}
