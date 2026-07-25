import Image, { type ImageProps } from "next/image";

type ThemeImageProps = Omit<ImageProps, "src"> & {
  lightSrc: string;
  darkSrc: string;
};

export function ThemeImage({
  lightSrc,
  darkSrc,
  alt,
  className = "",
  ...props
}: ThemeImageProps) {
  return (
    <>
      <Image
        {...props}
        src={lightSrc}
        alt={alt}
        className={`hidden light:block ${className}`}
      />
      <Image
        {...props}
        src={darkSrc}
        alt={alt}
        className={`block light:hidden ${className}`}
      />
    </>
  );
}
