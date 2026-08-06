type SectionEyebrowProps = {
  children: string;
  className?: string;
};

export function SectionEyebrow({
  children,
  className = "",
}: SectionEyebrowProps) {
  return (
    <p
      className={`text-body-sm text-foreground ${className}`}
    >{`{ ${children} }`}</p>
  );
}
