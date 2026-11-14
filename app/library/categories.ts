export const categories = {
  moon: '/apollo.webp',
  mars: '/spirit.webp',
  space: '/m87-black-hole.webp',
} as const;

export type Category = keyof typeof categories;
export const categoryIds = Object.keys(categories) as Category[];
