export const MIN_AMOUNT = 0.0000001;
export const MAX_MESSAGE_LENGTH = 280;

export function validateAmount(value: string): string | null {
  const num = Number(value);
  if (!value || isNaN(num)) return "Amount is required";
  if (num < MIN_AMOUNT) {
    const minimum = new Intl.NumberFormat("en-US", { maximumFractionDigits: 20 }).format(
      MIN_AMOUNT
    );
    return `Minimum amount is ${minimum}`;
  }
  return null;
}

export function validateMessage(value: string): string | null {
  if (value.length > MAX_MESSAGE_LENGTH)
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
  return null;
}
