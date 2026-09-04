import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  GenerateIdeasForm,
  OwnEntryForm,
  RequestBriefButton,
} from "@/components/calendar/DayForms";
import { SurfaceCard } from "@/components/SurfaceCard";
import { requireBusiness } from "@/lib/auth/guards";
import { formatJalali, parseUtcDateKey } from "@/lib/jalali";
import { decideOccasionForm, deleteOwnEntry } from "@/lib/mocalendar/actions";
import {
  isLateForLead,
  occasionsForField,
  occasionsOnDay,
} from "@/lib/mocalendar/calendars";
import {
  BRIEF_STATUS_LABELS,
  ENTRY_STATUS_LABELS,
  KIND_LABELS,
  SUGGESTED_KIND_LABELS,
} from "@/lib/mocalendar/labels";
import { toPersianDigits } from "@/lib/persian";
import { getActiveOccasions, getEntriesByDate } from "@/lib/queries/mocalendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "روز تقویم",
};

type PageProps = {
  params: Promise<{ date: string }>;
};

export default async function CalendarDayPage({ params }: PageProps) {
  const { business } = await requireBusiness();
  const { date: dateKey } = await params;
  const date = parseUtcDateKey(dateKey);
  if (!date) notFound();

  const [occasions, entries] = await Promise.all([
    getActiveOccasions(),
    getEntriesByDate(business._id, date),
  ]);
  const dayOccasions = occasionsOnDay(
    occasionsForField(occasions, business.fieldSlug),
    date,
  );
  const own = entries.filter((entry) => !entry.occasionSlug);
  const byOccasion = new Map(
    entries
      .filter((entry) => entry.occasionSlug)
      .map((entry) => [entry.occasionSlug as string, entry]),
  );

  return (
    <div className="flex flex-col gap-24">
      <div>
        <Link href="/calendar" className="text-caption text-surface-50">
          بازگشت به ماه
        </Link>
        <h1 className="mt-8 text-heading-sm tracking-heading-sm text-foreground">
          {formatJalali(date, toPersianDigits)}
        </h1>
      </div>

      <section className="flex flex-col gap-16">
        <h2 className="text-body font-bold text-foreground">مناسبت‌ها</h2>
        {dayOccasions.length === 0 ? (
          <SurfaceCard variant="empty">
            مناسبت مرتبطی در این روز نیست.
          </SurfaceCard>
        ) : null}
        {dayOccasions.map((occasion) => {
          const entry = byOccasion.get(occasion.slug);
          const late = isLateForLead(date, occasion.leadTimeDays);
          return (
            <SurfaceCard key={occasion.slug} variant="panel">
              <div className="flex flex-wrap items-start justify-between gap-12">
                <div>
                  <p className="text-body font-bold text-foreground">
                    {occasion.title}
                  </p>
                  <p className="mt-6 text-caption text-surface-50">
                    پیشنهاد: {SUGGESTED_KIND_LABELS[occasion.suggestedKind]}
                    {late ? " · دیر است برای سفارش طراحی" : ""}
                  </p>
                  {occasion.description ? (
                    <p className="mt-8 text-body-sm text-surface-50">
                      {occasion.description}
                    </p>
                  ) : null}
                </div>
              </div>

              {!entry || entry.status === "skipped" ? (
                <form
                  action={decideOccasionForm}
                  className="mt-16 flex flex-wrap gap-8"
                >
                  <input type="hidden" name="date" value={dateKey} />
                  <input
                    type="hidden"
                    name="occasionSlug"
                    value={occasion.slug}
                  />
                  <button
                    type="submit"
                    name="decision"
                    value="campaign"
                    className="rounded-full bg-shockingly-green px-16 py-8 text-caption font-bold text-background"
                  >
                    کمپین
                  </button>
                  <button
                    type="submit"
                    name="decision"
                    value="poster"
                    className="rounded-full border border-surface-25 px-16 py-8 text-caption"
                  >
                    پوستر
                  </button>
                  <button
                    type="submit"
                    name="decision"
                    value="skip"
                    className="rounded-full px-16 py-8 text-caption text-surface-50"
                  >
                    رد
                  </button>
                </form>
              ) : (
                <div className="mt-16 flex flex-col gap-16">
                  <p className="text-body-sm text-foreground">
                    تصمیم: {KIND_LABELS[entry.kind]} ·{" "}
                    {ENTRY_STATUS_LABELS[entry.status]}
                  </p>
                  {entry.request ? (
                    <p className="text-body-sm text-shockingly-green">
                      سفارش طراحی: {BRIEF_STATUS_LABELS[entry.request.status]}
                    </p>
                  ) : (
                    <>
                      <GenerateIdeasForm
                        entryId={entry._id}
                        dateKey={dateKey}
                      />
                      {entry.ideas.map((idea, index) => (
                        <div
                          key={`${idea.title}-${index}`}
                          className="card-chrome rounded-lg p-16"
                        >
                          <p className="text-body-sm font-bold">{idea.title}</p>
                          <p className="mt-6 text-caption text-surface-50">
                            {idea.hook}
                          </p>
                          <p className="mt-8 text-body-sm">{idea.caption}</p>
                          <p className="mt-8 text-caption text-surface-50">
                            تصویر: {idea.visualDirection}
                          </p>
                          <p className="mt-6 text-caption">CTA: {idea.cta}</p>
                          <div className="mt-12">
                            <RequestBriefButton
                              entryId={entry._id}
                              dateKey={dateKey}
                              ideaIndex={index}
                              late={late}
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </SurfaceCard>
          );
        })}
      </section>

      <section className="flex flex-col gap-16">
        <h2 className="text-body font-bold text-foreground">محتوای خودتان</h2>
        {own.map((entry) => (
          <SurfaceCard
            key={entry._id}
            variant="panel"
            className="flex flex-col gap-16"
          >
            <OwnEntryForm dateKey={dateKey} entry={entry} />
            <DeleteButton action={deleteOwnEntry} id={entry._id} />
          </SurfaceCard>
        ))}
        <SurfaceCard variant="panel">
          <OwnEntryForm dateKey={dateKey} />
        </SurfaceCard>
      </section>
    </div>
  );
}
