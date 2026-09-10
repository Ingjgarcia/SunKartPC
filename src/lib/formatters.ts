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
  taxRate?: number; // default 0.18 (18% ITBIS incluido)
  discount?: number;
}) {
  const taxRate = params.taxRate ?? 0.18;
  const discount = Number((params.discount || 0).toFixed(2));
  const rawTotal = params.unitPrice * params.quantity;
  const total = Number(Math.max(0, rawTotal - discount).toFixed(2));

  // ITBIS (18%) incluido: Subtotal (base imponible) = Total / (1 + taxRate)
  const subtotal = Number((total / (1 + taxRate)).toFixed(2));
  const tax = Number((total - subtotal).toFixed(2));

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
