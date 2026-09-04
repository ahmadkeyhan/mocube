import "server-only";
import { fieldName } from "@/lib/mocalendar/fields";
import type { AiIdea, Business, OccasionKind } from "@/lib/models/types";

export const AI_DAILY_CAP = 8;

type IdeaContext = {
  business: Pick<
    Business,
    "name" | "fieldSlug" | "audience" | "tone" | "city" | "instagram"
  >;
  occasionTitle: string;
  occasionDescription: string;
  kind: OccasionKind;
  feedback?: string;
};

export async function generateCampaignIdeas(
  context: IdeaContext,
): Promise<AiIdea[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY تنظیم نشده است.");
  }

  const base = (
    process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
  ).replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const field = fieldName(context.business.fieldSlug);

  const system = `تو استراتژیست محتوای شبکه‌های اجتماعی برای برندهای ایرانی هستی.
جواب را فقط JSON بده، به این شکل:
{"ideas":[{"title":"","hook":"","caption":"","visualDirection":"","cta":""}]}
سه ایده بده. فارسی بنویس. کپشن آمادهٔ انتشار باشد.`;

  const user = [
    `کسب‌وکار: ${context.business.name}`,
    `حوزه: ${field}`,
    context.business.city ? `شهر: ${context.business.city}` : "",
    context.business.audience ? `مخاطب: ${context.business.audience}` : "",
    context.business.tone ? `لحن: ${context.business.tone}` : "",
    `مناسبت: ${context.occasionTitle}`,
    context.occasionDescription
      ? `توضیح مناسبت: ${context.occasionDescription}`
      : "",
    `نوع خروجی: ${context.kind === "campaign" ? "کمپین" : "پوستر"}`,
    context.feedback ? `بازخورد برای بازتولید: ${context.feedback}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("تولید ایده ناموفق بود. دوباره تلاش کنید.");
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = payload.choices?.[0]?.message?.content ?? "";
  return parseIdeas(raw);
}

function parseIdeas(raw: string): AiIdea[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("پاسخ مدل قابل خواندن نبود.");
  }

  const list = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === "object" &&
        "ideas" in parsed &&
        Array.isArray((parsed as { ideas: unknown }).ideas)
      ? (parsed as { ideas: unknown[] }).ideas
      : [];

  const ideas = list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const text = (key: string) =>
        typeof row[key] === "string" ? (row[key] as string).trim() : "";
      const idea: AiIdea = {
        title: text("title"),
        hook: text("hook"),
        caption: text("caption"),
        visualDirection: text("visualDirection"),
        cta: text("cta"),
      };
      if (!idea.title || !idea.caption) return null;
      return idea;
    })
    .filter((idea): idea is AiIdea => idea !== null)
    .slice(0, 3);

  if (ideas.length === 0) {
    throw new Error("ایده‌ای از مدل برنگشت.");
  }
  return ideas;
}
