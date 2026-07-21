import { CategoryLabel } from "@/components/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { OrganicBlob } from "@/components/OrganicBlob";
import { PillButton } from "@/components/PillButton";
import type { ServiceColor } from "@/lib/models/types";

type ServiceBlockProps = {
  name: string;
  color: ServiceColor;
  shortDescription: string;
  slug: string;
  reverse?: boolean;
};

export function ServiceBlock({
  name,
  color,
  shortDescription,
  slug,
  reverse = false,
}: ServiceBlockProps) {
  return (
    <div
      className={`grid items-center gap-32 py-76 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <Reveal fromScale={0.85} fromRotate={-4} className="flex justify-center">
        <OrganicBlob color={color} delay={reverse ? 0.4 : 0} />
      </Reveal>
      <Reveal delay={0.1}>
        <CategoryLabel label={name} color={color} />
        <h3 className="mt-16 text-subheading tracking-subheading text-surface-cream md:text-heading-sm md:tracking-heading-sm">
          {shortDescription}
        </h3>
        <div className="mt-24">
          <PillButton href={`/services/${slug}`}>کاوش {name}</PillButton>
        </div>
      </Reveal>
    </div>
  );
}
