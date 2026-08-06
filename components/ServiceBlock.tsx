import { CategoryLabel } from "@/components/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { PillButton } from "@/components/PillButton";
import { ThemeImage } from "@/components/theme/ThemeImage";
import type { ServiceColor } from "@/lib/models/types";
import { serviceGradient } from "@/lib/service-colors";
import type { ThemeImagePair } from "@/lib/service-images";

type ServiceBlockProps = {
  name: string;
  color: ServiceColor;
  shortDescription: string;
  slug: string;
  reverse?: boolean;
  imageSrc?: ThemeImagePair;
};

export function ServiceBlock({
  name,
  color,
  shortDescription,
  slug,
  reverse = false,
  imageSrc,
}: ServiceBlockProps) {
  return (
    <div>
      <Reveal fromScale={0.85} fromRotate={-4}>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg md:aspect-4/3">
          {imageSrc ? (
            <ThemeImage
              lightSrc={imageSrc.light}
              darkSrc={imageSrc.dark}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: serviceGradient[color] }}
              aria-hidden
            />
          )}
          <Reveal
            delay={0.1}
            className={`absolute inset-0 z-10 flex flex-col p-24 md:p-40 ${
              reverse ? "items-end text-end" : "items-start text-start"
            }`}
          >
            <CategoryLabel label={name} color={color} />
            <h3 className="mt-16 max-w-xl text-subheading tracking-subheading text-foreground md:text-heading-sm md:tracking-heading-sm">
              {shortDescription}
            </h3>
            <div className="mt-24 pointer-events-auto">
              <PillButton href={`/services/${slug}`}>کاوش {name}</PillButton>
            </div>
          </Reveal>
        </div>
      </Reveal>
    </div>
  );
}
