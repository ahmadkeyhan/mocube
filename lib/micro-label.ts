export function microHash(name: string) {
  return name.startsWith("#") ? name : `#${name}`;
}
