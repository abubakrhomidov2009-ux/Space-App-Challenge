// Schematic coordinates. The dates are mission events, and the drawing has no distance scale.
export const voyagerEvents = [
  { year: 1977, x: 28, y: 132, ru: 'Старт с Земли', en: 'Launch from Earth', tg: 'Парвоз аз Замин' },
  { year: 1979, x: 92, y: 102, ru: 'Пролёт Юпитера', en: 'Jupiter flyby', tg: 'Гузар аз назди Муштарӣ' },
  { year: 1980, x: 161, y: 65, ru: 'Пролёт Сатурна', en: 'Saturn flyby', tg: 'Гузар аз назди Зуҳал' },
  { year: 1990, x: 270, y: 65, ru: 'Снимок Pale Blue Dot', en: 'Pale Blue Dot image', tg: 'Акси Pale Blue Dot' },
  { year: 2012, x: 480, y: 46, ru: 'Выход в межзвёздное пространство', en: 'Entry into interstellar space', tg: 'Вуруд ба фазои байниситоравӣ' },
] as const;

export const voyagerRouteSource = 'https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/';
