export const pascalCase = (title: string) =>
  title
    .split(/[\s_-]+/u)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");