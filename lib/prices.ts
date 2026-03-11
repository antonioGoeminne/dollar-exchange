export const formatPrice = (price: string) => {
  if (!price) return "0";

  const num = parseFloat(price);
  const hasDecimals = num % 1 !== 0;

  if (!hasDecimals) {
    return String(Math.round(num));
  }

  const [intPart, decPart] = num.toFixed(2).split(".");
  return `${intPart},${decPart}`;
};
