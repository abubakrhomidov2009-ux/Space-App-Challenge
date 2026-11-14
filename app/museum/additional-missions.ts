export const additionalMissions = {
  surveyor: { kind: 'lander',
    world: 'moon', latitude: -3.0162, longitude: -23.418,
    image: '/surveyor.webp', imageKind: 'archive', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/mission/surveyor-3/',
      coordinates: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html',
      photo: 'https://commons.wikimedia.org/wiki/File:Surveyor_3_Conrad.jpg',
    },
    copy: {
      ru: { name: 'Surveyor 3', location: 'Луна · Океан Бурь', intro: 'Робот с ковшом помог выяснить, выдержит ли лунный грунт вес пилотируемого аппарата.', story: [
        'В апреле 1967 года Surveyor 3 мягко сел в Океане Бурь и исследовал грунт механическим ковшом. Результаты помогли подготовить посадки Apollo.',
        'В 1969 году экипаж Apollo 12 сел неподалёку и вернул на Землю несколько деталей Surveyor 3. Сам посадочный аппарат остался на Луне.',
      ] },
      en: { name: 'Surveyor 3', location: 'Moon · Ocean of Storms', intro: 'A robotic scoop helped test whether lunar soil could support a crewed lander.', story: [
        'Surveyor 3 soft-landed in the Ocean of Storms in April 1967 and used its scoop to test the soil. The results helped prepare for the Apollo landings.',
        'In 1969 Apollo 12 landed nearby and brought several Surveyor 3 components back to Earth. The lander itself stayed on the Moon.',
      ] },
      tg: { name: 'Surveyor 3', location: 'Моҳ · Уқёнуси Тӯфонҳо', intro: 'Кафлези роботӣ барои санҷидани он кумак кард, ки хоки Моҳ вазни дастгоҳи фурудро бардошта метавонад ё не.', story: [
        'Surveyor 3 моҳи апрели соли 1967 дар Уқёнуси Тӯфонҳо нарм фуруд омад ва хоки Моҳро бо кафлез санҷид. Натиҷаҳо ба омодагӣ ба фурудҳои Apollo кумак карданд.',
        'Соли 1969 ҳайати Apollo 12 дар наздикӣ фуруд омад ва чанд ҷузъи Surveyor 3-ро ба Замин баргардонд. Худи дастгоҳи фуруд дар Моҳ монд.',
      ] },
    },
  },
  apollo15: { kind: 'rover',
    world: 'moon', latitude: 26.13239, longitude: 3.63330,
    image: '/apollo15.webp', imageKind: 'archive', siteKind: 'landing',
    sources: {
      mission: 'https://www.nasa.gov/missions/apollo/apollo-15-mission-details/',
      coordinates: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html',
      photo: 'https://commons.wikimedia.org/wiki/File:Apollo_15_flag,_rover,_LM,_Irwin.jpg',
    },
    copy: {
      ru: { name: 'Луноход Apollo 15', location: 'Луна · борозда Хэдли', intro: 'Первый автомобиль, на котором астронавты ездили по Луне.', story: [
        'В 1971 году Дэвид Скотт и Джеймс Ирвин использовали электрический луноход, чтобы осмотреть окрестности борозды Хэдли и собрать образцы вдали от посадочного модуля.',
        'Перед взлётом луноход поставили так, чтобы его телекамера могла запечатлеть отлёт. Он остался рядом с местом посадки.',
      ] },
      en: { name: 'Apollo 15 lunar rover', location: 'Moon · Hadley Rille', intro: 'The first vehicle astronauts drove on the Moon.', story: [
        'In 1971 David Scott and James Irwin used the electric rover to explore Hadley Rille and collect samples far from the lunar module.',
        'Before liftoff they parked it so its television camera could capture their departure. It remains near the landing site.',
      ] },
      tg: { name: 'Моҳгарди Apollo 15', location: 'Моҳ · ҷӯяки Ҳедли', intro: 'Аввалин мошине, ки кайҳоннавардон дар рӯйи Моҳ ронданд.', story: [
        'Соли 1971 Дэвид Скотт ва Ҷеймс Ирвин бо моҳгарди барқӣ атрофи ҷӯяки Ҳедлиро омӯхтанд ва дуртар аз модули фуруд намунаҳо ҷамъ карданд.',
        'Пеш аз парвоз онҳо мошинро тавре гузоштанд, ки камераи он парвозро сабт карда тавонад. Моҳгард дар наздикии маҳалли фуруд монд.',
      ] },
    },
  },
  viking: { kind: 'lander',
    world: 'mars', latitude: 22.27, longitude: 312.05,
    image: '/viking.webp', imageKind: 'vikingModel', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/mission/viking-1/',
      coordinates: 'https://nssdc.gsfc.nasa.gov/planetary/viking.html',
      photo: 'https://science.nasa.gov/photojournal/viking-lander-model/',
    },
    copy: {
      ru: { name: 'Viking 1', location: 'Марс · равнина Хриса', intro: 'Посадочный аппарат передал панорамы Марса и провёл эксперименты по поиску признаков жизни.', story: [
        'Viking 1 сел в июле 1976 года. Анализы грунта выявили неожиданную химическую активность. Однозначных свидетельств жизни эксперименты не дали.',
        'Аппарат проработал более шести лет и остался на равнине Хриса после потери связи в ноябре 1982 года.',
      ] },
      en: { name: 'Viking 1', location: 'Mars · Chryse Planitia', intro: 'This lander sent back Martian panoramas and tested soil for signs of life.', story: [
        'Viking 1 landed in July 1976. Its soil tests revealed unexpected chemical activity. The experiments produced no conclusive evidence of life.',
        'The lander worked for more than six years and remained on Chryse Planitia after contact ended in November 1982.',
      ] },
      tg: { name: 'Viking 1', location: 'Миррих · ҳамвории Хриса', intro: 'Дастгоҳи фуруд манзараҳои Миррихро фиристод ва хокро барои ҷустуҷӯи нишонаҳои ҳаёт санҷид.', story: [
        'Viking 1 моҳи июли соли 1976 фуруд омад. Озмоишҳо фаъолияти ғайричашмдошти кимиёвиро нишон доданд. Далели қатъии ҳаёт ёфт нашуд.',
        'Дастгоҳ зиёда аз шаш сол кор кард ва баъди қатъи иртибот дар ноябри соли 1982 дар ҳамвории Хриса монд.',
      ] },
    },
  },
  pathfinder: { kind: 'combined',
    world: 'mars', latitude: 19.07, longitude: 326.48,
    image: '/pathfinder.webp', imageKind: 'jplPhoto', siteKind: 'landing',
    sources: {
      mission: 'https://science.nasa.gov/wp-content/uploads/2023/09/DSC_monograph24.pdf',
      coordinates: 'https://ntrs.nasa.gov/api/citations/20260002020/downloads/NASA-TM20260002020.pdf',
      photo: 'https://commons.wikimedia.org/wiki/File:Pathfinder_and_Sojourner_%2818647779303%29.jpg',
    },
    copy: {
      ru: { name: 'Pathfinder и Sojourner', location: 'Марс · долина Арес', intro: 'Pathfinder привёз на Марс Sojourner, первый колёсный аппарат на другой планете.', story: [
        '4 июля 1997 года Pathfinder сел в долине Арес с помощью надувных амортизаторов. Sojourner съехал по пандусу и изучал состав камней рядом со станцией.',
        'Последние данные Pathfinder получил центр управления 27 сентября 1997 года. Станция и марсоход остались в районе посадки.',
      ] },
      en: { name: 'Pathfinder and Sojourner', location: 'Mars · Ares Vallis', intro: 'Pathfinder carried Sojourner, the first wheeled vehicle to operate on another planet.', story: [
        'On July 4, 1997, Pathfinder landed in Ares Vallis using airbags. Sojourner rolled down a ramp and analyzed nearby rocks.',
        'Mission control received the last data from Pathfinder on September 27, 1997. The lander and rover stayed in the landing area.',
      ] },
      tg: { name: 'Pathfinder ва Sojourner', location: 'Миррих · водии Арес', intro: 'Pathfinder дастгоҳи Sojourner-ро ба Миррих расонд. Ин аввалин мошини чархдор дар сайёраи дигар буд.', story: [
        '4 июли соли 1997 Pathfinder бо болиштҳои ҳавоӣ дар водии Арес фуруд омад. Sojourner аз пандус поён фаромад ва таркиби сангҳои наздикро омӯхт.',
        'Маркази идоракунӣ маълумоти охирини Pathfinder-ро 27 сентябри соли 1997 гирифт. Истгоҳ ва мошин дар наздикии маҳалли фуруд монданд.',
      ] },
    },
  },
} as const;
