import { ObjectId } from "mongodb";

export type FormState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class FieldErrors {
  private readonly errors: Record<string, string> = {};

  add(field: string, message: string) {
    if (!this.errors[field]) this.errors[field] = message;
  }

  get hasAny() {
    return Object.keys(this.errors).length > 0;
  }

  toState(message = "لطفاً خطاهای فرم را برطرف کنید."): FormState {
    return { message, fieldErrors: this.errors };
  }
}

export function text(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function requiredText(
  form: FormData,
  name: string,
  errors: FieldErrors,
  label: string,
): string {
  const value = text(form, name);
  if (!value) errors.add(name, `${label} الزامی است.`);
  return value;
}

export function slug(
  form: FormData,
  name: string,
  errors: FieldErrors,
): string {
  const value = text(form, name).toLowerCase();
  if (!value) {
    errors.add(name, "اسلاگ الزامی است.");
  } else if (!SLUG_PATTERN.test(value)) {
    errors.add(name, "اسلاگ فقط حروف کوچک انگلیسی، عدد و خط تیره.");
  }
  return value;
}

export function integer(form: FormData, name: string, fallback = 0): number {
  const parsed = Number.parseInt(text(form, name), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function boolean(form: FormData, name: string): boolean {
  return form.get(name) !== null;
}

export function lines(form: FormData, name: string): string[] {
  return text(form, name)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function objectIds(form: FormData, name: string): ObjectId[] {
  return form
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .filter((value) => ObjectId.isValid(value))
    .map((value) => new ObjectId(value));
}

export function objectId(
  form: FormData,
  name: string,
  errors: FieldErrors,
  label: string,
): ObjectId | null {
  const value = text(form, name);
  if (!ObjectId.isValid(value)) {
    errors.add(name, `${label} الزامی است.`);
    return null;
  }
  return new ObjectId(value);
}

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

export function duplicateSlugState(): FormState {
  return {
    message: "این اسلاگ قبلاً استفاده شده است.",
    fieldErrors: { slug: "اسلاگ باید یکتا باشد." },
  };
}
