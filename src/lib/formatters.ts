export function formatCurrency(amount: number | string, currency = "USD"): string {
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return "$0.00";

  if (currency === "DOP") {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(numeric);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(numeric);
}

export function convertToDop(amountUsd: number, exchangeRate = 60.0): number {
  return Number((amountUsd * exchangeRate).toFixed(2));
}

export function calculateOrderTotals(params: {
  unitPrice: number;
  quantity: number;
  taxRate?: number; // default 0.18 (18% ITBIS)
  discount?: number;
}) {
  const taxRate = params.taxRate ?? 0.18;
  const subtotal = Number((params.unitPrice * params.quantity).toFixed(2));
  const discount = Number((params.discount || 0).toFixed(2));
  const taxable = Math.max(0, subtotal - discount);
  const tax = Number((taxable * taxRate).toFixed(2));
  const total = Number((taxable + tax).toFixed(2));

  return {
    subtotal,
    discount,
    tax,
    total,
  };
}

export function generateOrderNumber(prefix = "SK"): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}

export function generatePassCode(prefix = "SK-PASS"): string {
  const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
  return `${prefix}-${hex}`;
}
