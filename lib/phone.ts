const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function normalizePhone(raw: string): string {
  let out = "";
  for (const ch of raw.trim()) {
    const persian = PERSIAN_DIGITS.indexOf(ch);
    if (persian >= 0) {
      out += String(persian);
      continue;
    }
    if (ch !== " " && ch !== "-") out += ch;
  }
  return out;
}

export function isValidPhone(raw: string): boolean {
  return /^(?:\+98|0098|98|0)?9\d{9}$/.test(normalizePhone(raw));
}
