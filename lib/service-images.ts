export type ThemeImagePair = {
  light: string;
  dark: string;
};

export const serviceImages: Partial<Record<string, ThemeImagePair>> = {
  branding: {
    light: "/brandIdentity-light.png",
    dark: "/brandIdentity-dark.png",
  },
};
