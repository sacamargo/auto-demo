export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/\0/g, '')
    .trim();
}
