import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
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
    <Reveal fromScale={0.85} fromRotate={-4}>
      <Link
        href={`/services/${slug}`}
        className="group block"
        aria-label={`کاوش ${name}`}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-lg lg:aspect-3/2">
          {imageSrc ? (
            <ThemeImage
              lightSrc={imageSrc.light}
              darkSrc={imageSrc.dark}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
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
              className={`text-heading-sm tracking-heading-sm transition-transform duration-300 ease-out group-hover:-translate-x-1 md:text-heading md:tracking-heading ${serviceColorClass[color]}`}
            >
              {name}
            </h3>
            <p className="mt-8 text-body-sm text-foreground sm:text-body">
              {shortDescription}
            </p>
            <span className="mt-16 inline-flex items-center justify-center rounded-full border border-surface-25 bg-background/50 px-20 py-12 text-body-sm font-bold text-foreground transition-colors group-hover:border-surface-50">
              کاوش {name}
            </span>
          </Reveal>
        </div>
      </Link>
    </Reveal>
  );
}
