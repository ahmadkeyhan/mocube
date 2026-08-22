import Image from "next/image";

type CustomerLogoProps = {
  name: string;
  logoUrl: string;
  className?: string;
};

function isColorLogo(url: string) {
  return !url || url.startsWith("#");
}

export function CustomerLogo({
  name,
  logoUrl,
  className = "",
}: CustomerLogoProps) {
  const box = `relative shrink-0 overflow-hidden rounded-full bg-off-background ${className}`;

  if (isColorLogo(logoUrl)) {
    return (
      <div
        className={`flex items-center justify-center font-bold text-background ${box}`}
        style={logoUrl ? { background: logoUrl } : undefined}
        aria-hidden
      >
        {name.slice(0, 1)}
      </div>
    );
  }

  return (
    <div className={box}>
      <Image
        src={logoUrl}
        alt=""
        fill
        className="object-cover"
        sizes="160px"
      />
    </div>
  );
}
