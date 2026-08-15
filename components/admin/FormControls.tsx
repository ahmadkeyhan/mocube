import type { ReactNode } from "react";

const controlClasses =
  "w-full rounded-lg border border-surface-25 bg-off-background px-12 py-10 text-body-sm text-foreground outline-none transition-colors placeholder:text-surface-50 focus:border-shockingly-green";

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-8">
      <label
        htmlFor={htmlFor}
        className="text-body-sm font-bold text-foreground"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-caption text-surface-50">{hint}</p> : null}
      {error ? (
        <p className="text-caption text-lipstick-pink">{error}</p>
      ) : null}
    </div>
  );
}

type TextInputProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: "text" | "password" | "number" | "tel";
  required?: boolean;
  dir?: "rtl" | "ltr";
};

export function TextInput({
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  dir,
}: TextInputProps) {
  return (
    <input
      id={name}
      name={name}
      type={type}
      dir={dir}
      required={required}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={controlClasses}
    />
  );
}

type TextAreaProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  dir?: "rtl" | "ltr";
};

export function TextArea({
  name,
  defaultValue,
  placeholder,
  rows = 4,
  dir,
}: TextAreaProps) {
  return (
    <textarea
      id={name}
      name={name}
      rows={rows}
      dir={dir}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={`${controlClasses} resize-y`}
    />
  );
}

export type Option = { value: string; label: string };

type SelectProps = {
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
};

export function Select({
  name,
  options,
  defaultValue,
  placeholder,
}: SelectProps) {
  return (
    <select
      id={name}
      name={name}
      defaultValue={defaultValue ?? ""}
      className={controlClasses}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type CheckboxGroupProps = {
  name: string;
  options: Option[];
  defaultValues?: string[];
};

export function CheckboxGroup({
  name,
  options,
  defaultValues = [],
}: CheckboxGroupProps) {
  const selected = new Set(defaultValues);

  return (
    <div className="card-chrome flex flex-wrap gap-8 rounded-lg p-12">
      {options.length === 0 ? (
        <p className="text-caption text-surface-50">موردی موجود نیست.</p>
      ) : null}
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-6 rounded-full border border-surface-25 px-12 py-6 text-caption text-foreground has-[:checked]:border-shockingly-green has-[:checked]:text-shockingly-green"
        >
          <input
            type="checkbox"
            name={name}
            value={option.value}
            defaultChecked={selected.has(option.value)}
            className="size-12 accent-shockingly-green"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

type ToggleProps = {
  name: string;
  label: string;
  defaultChecked?: boolean;
};

export function Toggle({ name, label, defaultChecked }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-10 text-body-sm text-foreground">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-16 accent-shockingly-green"
      />
      {label}
    </label>
  );
}

export function FormErrors({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="rounded-lg border border-lipstick-pink/50 bg-lipstick-pink/10 px-12 py-10 text-body-sm text-lipstick-pink">
      {message}
    </p>
  );
}
