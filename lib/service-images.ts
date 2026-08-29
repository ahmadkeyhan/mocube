export type ThemeImagePair = {
  light: string;
  dark: string;
};

export const serviceImages: Partial<Record<string, ThemeImagePair>> = {
  branding: {
    light: "/brandIdentity-light.webp",
    dark: "/brandIdentity-dark.webp",
  },
  merch: {
    light: "/merchandise-light.webp",
    dark: "/merchandise-dark.webp",
  },
  web: {
    light: "/webdev-light.webp",
    dark: "/webdev-light.webp",
  },
  illustration: {
    light: "/merchandise-light.webp",
    dark: "/merchandise-dark.webp",
  }
};
