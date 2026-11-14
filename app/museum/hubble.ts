export const hubble = {
  world: 'space', kind: 'telescope',
  image: '/hubble.webp', imageKind: 'archive', siteKind: 'orbit',
  sources: {
    mission: 'https://science.nasa.gov/mission/hubble/',
    coordinates: 'https://science.nasa.gov/mission/hubble/observatory/',
    photo: 'https://science.nasa.gov/image-detail/hubble-released-at-end-of-sm4/',
  },
  copy: {
    ru: {
      name: 'Хаббл', location: 'Космос · орбита Земли',
      intro: 'Космический телескоп фотографирует далёкие звёзды и галактики с орбиты Земли.',
      story: [
        '24 апреля 1990 года шаттл Discovery доставил «Хаббл» в космос. Над атмосферой он наблюдает Вселенную в ультрафиолетовом, видимом и ближнем инфракрасном диапазонах.',
        'Снимки Hubble Deep Field показали множество далёких галактик в крошечном участке неба. На фото телескоп отделяется от шаттла Atlantis после обслуживания в мае 2009 года.',
      ],
    },
    en: {
      name: 'Hubble', location: 'Space · Earth orbit',
      intro: 'The space telescope photographs distant stars and galaxies from Earth orbit.',
      story: [
        'Space shuttle Discovery launched Hubble on April 24, 1990. Above the atmosphere, it observes the universe in ultraviolet, visible, and near-infrared light.',
        'The Hubble Deep Field revealed many distant galaxies in a tiny patch of sky. The photo shows Hubble drifting away from Atlantis after its May 2009 servicing mission.',
      ],
    },
    tg: {
      name: 'Ҳаббл', location: 'Кайҳон · мадори Замин',
      intro: 'Телескопи кайҳонӣ аз мадори Замин ситораҳо ва галактикаҳои дурро аксбардорӣ мекунад.',
      story: [
        '24 апрели соли 1990 киштии Discovery «Ҳаббл»-ро ба кайҳон бурд. Телескоп берун аз атмосфера Коинотро дар нурҳои ултрабунафш, намоён ва инфрасурхи наздик мушоҳида мекунад.',
        'Тасвирҳои Hubble Deep Field дар як қисми хурди осмон галактикаҳои зиёди дурро нишон доданд. Дар акс телескоп баъди таъмири моҳи майи соли 2009 аз киштии Atlantis дур мешавад.',
      ],
    },
  },
} as const;
