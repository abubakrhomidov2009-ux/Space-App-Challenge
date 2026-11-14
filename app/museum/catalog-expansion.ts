export const catalogExpansion = {
  apollo17: {
    world: 'moon', kind: 'lander', latitude: 20.1911, longitude: 30.7723,
    image: '/apollo17.webp', imageKind: 'archive', siteKind: 'position',
    sources: {
      mission: 'https://www.nasa.gov/missions/apollo/apollo-17-mission-details/',
      coordinates: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html',
      photo: 'https://www.nasa.gov/image-article/apollo-17s-moonship/',
    },
    copy: {
      ru: { name: 'Apollo 17 · Challenger', location: 'Луна · долина Таурус — Литтров', intro: 'Посадочная ступень модуля Challenger осталась на месте высадки Apollo 17.', story: [
        '11 декабря 1972 года Юджин Сернан и Харрисон Шмитт высадились в долине Таурус — Литтров. Они изучили местную геологию, установили научные приборы и собрали около 110 кг лунных образцов.',
        'На снимке показана взлётная ступень после старта с Луны. Нижняя ступень служила площадкой для взлёта и осталась в долине.',
      ] },
      en: { name: 'Apollo 17 · Challenger', location: 'Moon · Taurus–Littrow', intro: 'Challenger’s descent stage remains at the Apollo 17 landing site.', story: [
        'Eugene Cernan and Harrison Schmitt landed in the Taurus–Littrow valley on December 11, 1972. They studied the local geology, deployed scientific instruments, and collected about 110 kg of lunar samples.',
        'The photo shows the ascent stage after liftoff. The descent stage served as its launch platform and remains in the valley.',
      ] },
      tg: { name: 'Apollo 17 · Challenger', location: 'Моҳ · водии Таурус — Литтроу', intro: 'Зинаи поёнии Challenger дар маҳалли фуруди Apollo 17 боқӣ мондааст.', story: [
        '11 декабри соли 1972 Юҷин Сернан ва Ҳаррисон Шмитт дар водии Таурус — Литтроу фуруд омаданд. Онҳо геологияи маҳалро омӯхтанд, асбобҳои илмӣ насб карданд ва тақрибан 110 кг намуна ҷамъ оварданд.',
        'Дар акс зинаи болоӣ баъди парвоз аз Моҳ дида мешавад. Зинаи поёнӣ ҳамчун майдончаи парвоз хизмат кард ва дар водӣ монд.',
      ] },
    },
  },
  insight: {
    world: 'mars', kind: 'lander', latitude: 4.5, longitude: 135.9,
    image: '/insight.webp', imageKind: 'jplPhoto', siteKind: 'landingRegion',
    sources: {
      mission: 'https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/',
      coordinates: 'https://www.jpl.nasa.gov/news/press_kits/insight/landing/mission/landing-site/',
      photo: 'https://science.nasa.gov/photojournal/insights-final-selfie/',
    },
    copy: {
      ru: { name: 'InSight', location: 'Марс · равнина Элизий', intro: 'Сейсмометр InSight помог изучить внутреннее строение Марса по колебаниям грунта.', story: [
        'Аппарат сел в 2018 году. Он записывал марсотрясения, а учёные использовали сейсмические волны, чтобы изучить кору, мантию и ядро планеты.',
        'По мере накопления пыли солнечные панели вырабатывали всё меньше энергии. Последний сеанс связи состоялся 15 декабря 2022 года. Метка показывает район посадки.',
      ] },
      en: { name: 'InSight', location: 'Mars · Elysium Planitia', intro: 'InSight used a seismometer to study the interior of Mars.', story: [
        'The lander arrived in 2018. It recorded marsquakes, and scientists used the seismic waves to study the planet’s crust, mantle, and core.',
        'Dust gradually reduced the solar panels’ output. The last contact was on December 15, 2022. The marker indicates the landing region.',
      ] },
      tg: { name: 'InSight', location: 'Миррих · ҳамвории Элизий', intro: 'Сейсмометри InSight барои омӯхтани сохтори дохилии Миррих кумак кард.', story: [
        'Дастгоҳ соли 2018 фуруд омад. Он ларзишҳои Миррихро сабт кард ва олимон бо ёрии мавҷҳои сейсмикӣ қишр, мантия ва ядрои сайёраро омӯхтанд.',
        'Ғубор тадриҷан иқтидори панелҳои офтобиро кам кард. Тамоси охирин 15 декабри соли 2022 буд. Нишона минтақаи фурудро нишон медиҳад.',
      ] },
    },
  },
  spitzer: {
    world: 'space', kind: 'telescope',
    image: '/spitzer.webp', imageKind: 'illustration', siteKind: 'orbit',
    sources: {
      mission: 'https://science.nasa.gov/missions/spitzer/nasas-spitzer-space-telescope-ends-mission-of-astronomical-discovery/',
      coordinates: 'https://science.nasa.gov/mission/spitzer/',
      photo: 'https://science.nasa.gov/resource/spitzer-space-telescope/',
    },
    copy: {
      ru: { name: 'Спитцер', location: 'Космос · орбита вокруг Солнца', intro: 'Инфракрасный телескоп наблюдал объекты, скрытые космической пылью.', story: [
        'Спитцер запустили в 2003 году на орбиту вокруг Солнца, по которой он следовал за Землёй. Среди его наблюдений были планеты системы TRAPPIST-1.',
        '30 января 2020 года NASA завершило работу телескопа после более чем 16 лет наблюдений.',
      ] },
      en: { name: 'Spitzer', location: 'Space · orbit around the Sun', intro: 'This infrared telescope observed objects hidden by cosmic dust.', story: [
        'Spitzer launched in 2003 into an Earth-trailing orbit around the Sun. Its observations included planets in the TRAPPIST-1 system.',
        'NASA ended the mission on January 30, 2020, after more than 16 years of observations.',
      ] },
      tg: { name: 'Спитсер', location: 'Кайҳон · мадор гирди Офтоб', intro: 'Ин телескопи инфрасурх ҷирмҳоеро мушоҳида мекард, ки дар паси ғубори кайҳонӣ пинҳон буданд.', story: [
        'Спитсер соли 2003 ба мадоре бароварда шуд, ки дар он аз паси Замин гирди Офтоб мегашт. Он сайёраҳои низоми TRAPPIST-1-ро низ мушоҳида кард.',
        'NASA 30 январи соли 2020 пас аз беш аз 16 соли мушоҳида миссияро анҷом дод.',
      ] },
    },
  },
} as const;
