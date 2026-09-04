export type BusinessField = {
  slug: string;
  name: string;
};

export const BUSINESS_FIELDS: BusinessField[] = [
  { slug: "cafe", name: "کافه و رستوران" },
  { slug: "fashion", name: "مد و پوشاک" },
  { slug: "clinic", name: "کلینیک و سلامت" },
  { slug: "gym", name: "باشگاه و تناسب اندام" },
  { slug: "realestate", name: "املاک" },
  { slug: "beauty", name: "زیبایی و آرایشگاه" },
  { slug: "education", name: "آموزش" },
  { slug: "tech", name: "فناوری و نرم‌افزار" },
  { slug: "retail", name: "فروشگاه و خرده‌فروشی" },
  { slug: "auto", name: "خودرو" },
  { slug: "travel", name: "سفر و گردشگری" },
  { slug: "kids", name: "کودک و خانواده" },
  { slug: "finance", name: "مالی و بیمه" },
  { slug: "arts", name: "هنر و فرهنگ" },
  { slug: "other", name: "سایر" },
];

const fieldBySlug = new Map(
  BUSINESS_FIELDS.map((field) => [field.slug, field]),
);

export function fieldName(slug: string): string {
  return fieldBySlug.get(slug)?.name ?? slug;
}

export function isFieldSlug(slug: string): boolean {
  return fieldBySlug.has(slug);
}
