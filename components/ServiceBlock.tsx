import { Reveal } from "@/components/motion/Reveal";
import { PillButton } from "@/components/PillButton";
import { ThemeImage } from "@/components/theme/ThemeImage";
import type { ServiceColor } from "@/lib/models/types";
import { serviceColorClass, serviceGradient } from "@/lib/service-colors";
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
        <div className="relative aspect-square w-full overflow-hidden rounded-lg md:aspect-4/3 lg:aspect-3/2">
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
            className={`absolute inset-0 z-10 flex flex-col p-24 ${
              reverse ? "items-end text-end" : "items-start text-start"
            }`}
          >
            <h3
              className={`text-subheading tracking-subheading md:text-heading-sm md:tracking-heading-sm lg:text-heading-lg lg:tracking-heading-lg ${serviceColorClass[color]}`}
            >
              {name}
            </h3>
            <p className="mt-8 max-w-xl text-body text-foreground lg:text-body-lg">
              {shortDescription}
            </p>
            <div className="mt-16 pointer-events-auto">
              <PillButton href={`/services/${slug}`}>کاوش {name}</PillButton>
            </div>
          </Reveal>
        </div>
      </Reveal>
    </div>
  );
}
