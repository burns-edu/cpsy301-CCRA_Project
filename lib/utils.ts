export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
