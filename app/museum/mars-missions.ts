export const marsMissions = {
  viking2: {
    world: 'mars', kind: 'lander', latitude: 48.269, longitude: 134.01,
    image: '/mars/viking2.webp', imageKind: 'hirise', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/mission/viking-2/',
      coordinates: 'https://www.eppcgs.org/cn/article/pdf/preview/10.26464/epp2023044.pdf',
      photo: 'https://science.nasa.gov/photojournal/viking-lander-2-gerald-a-soffen-memorial-station-imaged-from-orbit/',
    },
    copy: {
      ru: {
        name: "Viking 2",
        location: "Марс · равнина Утопия",
        intro: "Станция фотографировала марсианский иней и изучала местный грунт.",
        story: [
          "Аппарат сел в сентябре 1976 года. Он проводил химические и биологические эксперименты и следил за погодой.",
          "Работа завершилась в апреле 1980 года. Станция осталась на равнине Утопия.",
        ],
      },
      en: {
        name: "Viking 2",
        location: "Mars · Utopia Planitia",
        intro: "The lander photographed Martian frost and tested the local soil.",
        story: [
          "It landed in September 1976. It ran chemical and biological experiments and monitored the weather.",
          "Operations ended in April 1980. The lander remains in Utopia Planitia.",
        ],
      },
      tg: {
        name: "Viking 2",
        location: "Миррих · ҳамвории Утопия",
        intro: "Истгоҳ қирави рӯйи Миррихро аксбардорӣ кард ва хоки маҳаллиро санҷид.",
        story: [
          "Дастгоҳ моҳи сентябри соли 1976 фуруд омад. Он озмоишҳои кимиёвию биологӣ гузаронд ва обу ҳаворо мушоҳида кард.",
          "Кор моҳи апрели соли 1980 анҷом ёфт. Истгоҳ дар ҳамвории Утопия монд.",
        ],
      },
    },
  },
  phoenix: {
    world: 'mars', kind: 'lander', latitude: 68.2188, longitude: 234.2508,
    image: '/mars/phoenix.webp', imageKind: 'hirise', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/mission/mars-phoenix/',
      coordinates: 'https://ode.rsl.wustl.edu/mars/pagehelp/Content/Missions_Instruments/Landing_Sites.htm',
      photo: 'https://science.nasa.gov/photojournal/phoenix-lander-on-mars-with-surrounding-terrain-polar-projection/',
    },
    copy: {
      ru: {
        name: "Phoenix",
        location: "Марс · Северная равнина",
        intro: "Роботизированная рука станции вскрыла водяной лёд под грунтом.",
        story: [
          "Phoenix сел в мае 2008 года. Приборы станции подтвердили наличие водяного льда и выявили в грунте перхлораты.",
          "Последний сеанс связи состоялся в ноябре 2008 года, когда приближалась полярная зима.",
        ],
      },
      en: {
        name: "Phoenix",
        location: "Mars · Vastitas Borealis",
        intro: "The lander’s robotic arm uncovered water ice beneath the soil.",
        story: [
          "Phoenix landed in May 2008. Its instruments confirmed water ice and detected perchlorates in the soil.",
          "The last contact came in November 2008 as polar winter approached.",
        ],
      },
      tg: {
        name: "Phoenix",
        location: "Миррих · ҳамвории Шимолӣ",
        intro: "Дасти роботии истгоҳ яхи обро аз зери хок берун овард.",
        story: [
          "Phoenix моҳи майи соли 2008 фуруд омад. Асбобҳояш мавҷудияти яхи об ва перхлоратҳоро дар хок тасдиқ карданд.",
          "Тамоси охирин моҳи ноябри соли 2008, ҳангоми наздик шудани зимистони қутбӣ, сурат гирифт.",
        ],
      },
    },
  },
  beagle2: {
    world: 'mars', kind: 'lander', latitude: 11.5265, longitude: 90.4295,
    image: '/mars/beagle2.webp', imageKind: 'hirise', siteKind: 'position',
    sources: {
      mission: 'https://www.jpl.nasa.gov/news/lost-2003-mars-lander-found-by-mars-reconnaissance-orbiter/',
      coordinates: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5666264/',
      photo: 'https://science.nasa.gov/resource/components-of-beagle-2-flight-system-on-mars/',
    },
    copy: {
      ru: {
        name: "Beagle 2",
        location: "Марс · равнина Исиды",
        intro: "Аппарат сел на Марс, и лишь спустя годы его нашли на орбитальных снимках.",
        story: [
          "Станцию отправили изучать геологию и искать признаки жизни. После посадки в декабре 2003 года связь установить не удалось.",
          "Снимки показали, что солнечные панели, вероятно, раскрылись лишь частично и закрыли антенну.",
        ],
      },
      en: {
        name: "Beagle 2",
        location: "Mars · Isidis Planitia",
        intro: "The lander reached Mars and was found years later in orbital images.",
        story: [
          "It was sent to study geology and look for signs of life. It never established contact after its December 2003 landing.",
          "The images suggest that the solar panels only partly deployed, leaving the antenna covered.",
        ],
      },
      tg: {
        name: "Beagle 2",
        location: "Миррих · ҳамвории Исида",
        intro: "Дастгоҳ ба Миррих фуруд омад ва танҳо пас аз чанд сол дар аксҳои мадорӣ ёфт шуд.",
        story: [
          "Истгоҳ барои омӯзиши геология ва ҷустуҷӯи нишонаҳои ҳаёт фиристода шуд. Пас аз фуруд дар декабри соли 2003 бо он иртибот барқарор нашуд.",
          "Аксҳо нишон доданд, ки панелҳои офтобӣ эҳтимол қисман кушода шуда, мавҷгирро пӯшонидаанд.",
        ],
      },
    },
  },
  schiaparelli: {
    world: 'mars', kind: 'lander', latitude: -2.07, longitude: 353.79,
    image: '/mars/schiaparelli.webp', imageKind: 'hirise', siteKind: 'position',
    sources: {
      mission: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/Schiaparelli_landing_investigation_completed',
      coordinates: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/Mars_Reconnaissance_Orbiter_views_Schiaparelli_landing_site',
      photo: 'https://www.nasa.gov/image-article/schiaparelli-impact-site-mars-color/',
    },
    copy: {
      ru: {
        name: "Скиапарелли",
        location: "Марс · плато Меридиана",
        intro: "Испытательный модуль передал данные о спуске до удара о поверхность.",
        story: [
          "В октябре 2016 года ошибочная оценка высоты привела к преждевременному выключению двигателей. Модуль упал на плато Меридиана.",
          "Телеметрия помогла инженерам восстановить ход спуска. На снимке с орбиты видны следы падения.",
        ],
      },
      en: {
        name: "Schiaparelli",
        location: "Mars · Meridiani Planum",
        intro: "The test lander transmitted descent data before hitting the surface.",
        story: [
          "In October 2016 an incorrect altitude estimate caused the engines to shut down too early. The module crashed in Meridiani Planum.",
          "The telemetry let engineers reconstruct the descent. Orbital images show the impact traces.",
        ],
      },
      tg: {
        name: "Скиапарелли",
        location: "Миррих · ҳамвории Меридианӣ",
        intro: "Модули озмоишӣ пеш аз бархӯрд маълумоти фурудро фиристод.",
        story: [
          "Моҳи октябри соли 2016 ҳисобкунии нодурусти баландӣ муҳаррикҳоро бармаҳал хомӯш кард. Модул ба ҳамвории Меридианӣ афтод.",
          "Маълумоти фиристода ба муҳандисон имкон дод рафти фурудро барқарор кунанд. Дар акси мадорӣ осори бархӯрд дида мешавад.",
        ],
      },
    },
  },
  mars3: {
    world: 'mars', kind: 'lander', latitude: -45, longitude: 202,
    image: '/mars/mars3.webp', imageKind: 'hirise', siteKind: 'landingRegion',
    sources: {
      mission: 'https://www.jpl.nasa.gov/news/press_kits/insight/landing/appendix/history/',
      coordinates: 'https://www.giss.nasa.gov/tools/mars24/help/landers.html',
      photo: 'https://photojournal.jpl.nasa.gov/catalog/PIA16920',
    },
    copy: {
      ru: {
        name: "Марс-3",
        location: "Марс · Земля Сирен",
        intro: "Советская станция первой совершила мягкую посадку на Марс.",
        story: [
          "2 декабря 1971 года станция начала передачу с поверхности, но сигнал пропал примерно через 20 секунд.",
          "На орбитальном снимке есть объекты, похожие на детали станции. Их принадлежность не подтверждена, поэтому метка показывает район посадки.",
        ],
      },
      en: {
        name: "Mars 3",
        location: "Mars · Terra Sirenum",
        intro: "The Soviet lander made the first soft landing on Mars.",
        story: [
          "On December 2, 1971, it began transmitting from the surface, but the signal stopped after about 20 seconds.",
          "An orbital image shows possible spacecraft parts. Their identity is unconfirmed, so the marker shows the landing region.",
        ],
      },
      tg: {
        name: "Марс-3",
        location: "Миррих · Замини Сиренҳо",
        intro: "Истгоҳи шӯравӣ аввалин фуруди нармро дар Миррих анҷом дод.",
        story: [
          "2 декабри соли 1971 истгоҳ аз рӯйи сайёра сигнал фиристод, аммо он пас аз тақрибан 20 сония қатъ шуд.",
          "Дар акси мадорӣ ҷисмҳои монанд ба қисмҳои истгоҳ дида мешаванд. Азбаски ин тасдиқ нашудааст, нишона минтақаи фурудро нишон медиҳад.",
        ],
      },
    },
  },
  mars6: {
    world: 'mars', kind: 'lander', latitude: -23.9, longitude: 340.58,
    image: '/mars/mars6.webp', imageKind: 'marsImage', siteKind: 'landingRegion',
    sources: {
      mission: 'https://science.nasa.gov/wp-content/uploads/2023/09/DSC_monograph24.pdf',
      coordinates: 'https://www.giss.nasa.gov/tools/mars24/help/landers.html',
      photo: 'https://science.nasa.gov/photojournal/global-color-views-of-mars/',
    },
    copy: {
      ru: {
        name: "Марс-6",
        location: "Марс · район долин Самара",
        intro: "Спускаемый аппарат передал данные из атмосферы Марса в 1974 году.",
        story: [
          "Модуль измерял параметры атмосферы во время спуска на парашюте. Часть данных оказалась непригодной для анализа.",
          "Связь оборвалась вблизи поверхности. На глобусе отмечен расчётный район падения, а на снимке показан Марс из космоса.",
        ],
      },
      en: {
        name: "Mars 6",
        location: "Mars · Samara Valles region",
        intro: "The descent probe returned data from the Martian atmosphere in 1974.",
        story: [
          "It measured atmospheric conditions while descending by parachute. Some of the data proved unusable.",
          "Contact ended close to the surface. The globe marks the estimated impact region, and the image shows Mars from space.",
        ],
      },
      tg: {
        name: "Марс-6",
        location: "Миррих · минтақаи водиҳои Самара",
        intro: "Модули фуруд соли 1974 аз атмосфераи Миррих маълумот фиристод.",
        story: [
          "Дастгоҳ ҳангоми фуруд бо парашют шароити атмосфераро чен кард. Қисме аз маълумот барои таҳлил корношоям буд.",
          "Иртибот дар наздикии сатҳ қатъ шуд. Нишона минтақаи тахминии афтиданро нишон медиҳад. Дар акс Миррих аз кайҳон дида мешавад.",
        ],
      },
    },
  },
  zhurong: {
    world: 'mars', kind: 'rover', latitude: 25.07, longitude: 109.93,
    image: '/mars/zhurong.webp', imageKind: 'hirise', siteKind: 'landing',
    sources: {
      mission: 'https://www.nature.com/articles/s41586-022-05147-5',
      coordinates: 'https://www.giss.nasa.gov/tools/mars24/help/landers.html',
      photo: 'https://hirise.lpl.arizona.edu/ESP_077511_2055',
    },
    copy: {
      ru: {
        name: "Чжужун",
        location: "Марс · равнина Утопия",
        intro: "Китайский марсоход исследовал слои грунта с помощью радара.",
        story: [
          "Чжужун проехал по южной части равнины Утопия. Радар выявил несколько слоёв под поверхностью, которые помогли изучить историю отложений.",
          "В мае 2022 года ровер перевели в спящий режим. Снимки HiRISE позволили проверить его положение. Метка показывает место посадки платформы.",
        ],
      },
      en: {
        name: "Zhurong",
        location: "Mars · Utopia Planitia",
        intro: "China’s rover used radar to study layers below the Martian surface.",
        story: [
          "Zhurong drove across southern Utopia Planitia. Its radar detected subsurface layers that helped researchers study how the deposits formed.",
          "The rover entered hibernation in May 2022. HiRISE monitored its position from orbit. The marker shows the landing platform’s site.",
        ],
      },
      tg: {
        name: "Чжужун",
        location: "Миррих · ҳамвории Утопия",
        intro: "Миррихгарди чинӣ бо радар қабатҳои зери сатҳро омӯхт.",
        story: [
          "Чжужун дар ҷануби ҳамвории Утопия ҳаракат кард. Радар қабатҳои зеризаминиро ошкор намуд ва ба омӯзиши пайдоиши таҳшинҳо кумак кард.",
          "Моҳи майи соли 2022 дастгоҳ ба ҳолати хоб гузашт. HiRISE ҷойи онро аз мадор мушоҳида кард. Нишона маҳалли фуруди платформаро нишон медиҳад.",
        ],
      },
    },
  },
  ingenuity: {
    world: 'mars', kind: 'helicopter', latitude: 18.44, longitude: 77.45,
    image: '/mars/ingenuity.webp', imageKind: 'ingenuityPhoto', siteKind: 'landingRegion',
    sources: {
      mission: 'https://www.nasa.gov/missions/mars-2020-perseverance/ingenuity-helicopter/nasa-performs-first-aircraft-accident-investigation-on-another-world/',
      coordinates: 'https://www.giss.nasa.gov/tools/mars24/help/landers.html',
      photo: 'https://science.nasa.gov/photojournal/ingenuity-at-valinor-hills/',
    },
    copy: {
      ru: {
        name: "Ingenuity",
        location: "Марс · кратер Езеро",
        intro: "Первый вертолёт на другой планете совершил 72 полёта.",
        story: [
          "Ingenuity доказал, что в разреженной атмосфере Марса можно летать, и фотографировал местность для команды Perseverance.",
          "В январе 2024 года при последней посадке лопасти повредились. На фото видно, где вертолёт остался. Метка показывает район первоначальной посадки миссии.",
        ],
      },
      en: {
        name: "Ingenuity",
        location: "Mars · Jezero Crater",
        intro: "The first helicopter on another planet flew 72 times.",
        story: [
          "Ingenuity demonstrated powered flight in the thin Martian atmosphere and photographed terrain for the Perseverance team.",
          "Its blades were damaged during its final landing in January 2024. The photo shows where it stopped. The marker indicates the mission’s original landing area.",
        ],
      },
      tg: {
        name: "Ingenuity",
        location: "Миррих · танӯраи Езеро",
        intro: "Аввалин чархбол дар сайёраи дигар 72 парвоз анҷом дод.",
        story: [
          "Ingenuity нишон дод, ки дар атмосфераи тунуки Миррих парвоз кардан мумкин аст. Он барои дастаи Perseverance маҳалро аксбардорӣ кард.",
          "Ҳангоми фуруди охирин дар январи соли 2024 парраҳояш осеб диданд. Дар акс ҷойи охирини он дида мешавад. Нишона минтақаи фуруди аввали миссияро нишон медиҳад.",
        ],
      },
    },
  },
  polarlander: {
    world: 'mars', kind: 'lander', latitude: -76.1, longitude: 164.7,
    image: '/mars/polarlander.webp', imageKind: 'marsImage', siteKind: 'landingRegion',
    sources: {
      mission: 'https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/',
      coordinates: 'https://www.giss.nasa.gov/tools/mars24/help/landers.html',
      photo: 'https://science.nasa.gov/photojournal/proposed-mars-polar-lander-landing-site-perspective-view-1/',
    },
    copy: {
      ru: {
        name: "Mars Polar Lander",
        location: "Марс · южная полярная область",
        intro: "NASA отправило станцию изучать полярный грунт и климат Марса.",
        story: [
          "В декабре 1999 года после входа в атмосферу связь со станцией не восстановилась. По наиболее вероятной версии, двигатели выключились до касания грунта.",
          "Обломки не опознаны. Метка и снимок показывают запланированный район посадки.",
        ],
      },
      en: {
        name: "Mars Polar Lander",
        location: "Mars · south polar region",
        intro: "NASA sent the lander to study polar soil and Martian climate.",
        story: [
          "In December 1999 contact did not resume after atmospheric entry. Investigators considered premature engine shutdown the most likely cause.",
          "The wreckage has not been identified. The marker and image indicate the planned landing region.",
        ],
      },
      tg: {
        name: "Mars Polar Lander",
        location: "Миррих · минтақаи қутби ҷанубӣ",
        intro: "NASA истгоҳро барои омӯзиши хоки қутбӣ ва иқлими Миррих фиристод.",
        story: [
          "Моҳи декабри соли 1999 пас аз воридшавӣ ба атмосфера иртибот барқарор нашуд. Сабаби эҳтимолӣ пеш аз расидан ба сатҳ хомӯш шудани муҳаррикҳо буд.",
          "Боқимондаҳои дастгоҳ муайян нашудаанд. Нишона ва акс минтақаи пешбинишудаи фурудро нишон медиҳанд.",
        ],
      },
    },
  },
  "curiosity-stage": {
    world: 'mars', kind: 'hardware', latitude: -4.5895, longitude: 137.4417,
    image: '/mars/curiosity-stage.webp', imageKind: 'hirise', siteKind: 'landingRegion',
    sources: {
      mission: 'https://science.nasa.gov/resource/scene-of-a-martian-landing/',
      coordinates: 'https://ode.rsl.wustl.edu/mars/pagehelp/Content/Missions_Instruments/Landing_Sites.htm',
      photo: 'https://science.nasa.gov/resource/scene-of-a-martian-landing/',
    },
    copy: {
      ru: {
        name: "Посадочная ступень Curiosity",
        location: "Марс · кратер Гейла",
        intro: "Ракетная ступень опустила марсоход на тросах в 2012 году.",
        story: [
          "После касания грунта тросы отсоединились. Ступень отлетела на северо-запад и упала на безопасном расстоянии.",
          "На орбитальном снимке отмечены ступень и другие детали посадочной системы. Точка глобуса показывает район посадки марсохода.",
        ],
      },
      en: {
        name: "Curiosity descent stage",
        location: "Mars · Gale Crater",
        intro: "A rocket-powered stage lowered Curiosity on cables in 2012.",
        story: [
          "After touchdown the cables were cut. The stage flew northwest and crashed a safe distance away.",
          "The orbital image labels the stage and other landing hardware. The globe marks the rover’s landing region.",
        ],
      },
      tg: {
        name: "Зинаи фуруди Curiosity",
        location: "Миррих · танӯраи Гейл",
        intro: "Зинаи мушакӣ соли 2012 миррихгардро бо танобҳо ба сатҳ фаровард.",
        story: [
          "Пас аз расидани чархҳо ба хок танобҳо ҷудо шуданд. Зина ба шимолу ғарб парвоз карда, дар масофаи бехатар афтод.",
          "Дар акси мадорӣ зина ва дигар қисмҳои низоми фуруд нишон дода шудаанд. Нишона минтақаи фуруди миррихгардро нишон медиҳад.",
        ],
      },
    },
  },
  "perseverance-backshell": {
    world: 'mars', kind: 'hardware', latitude: 18.44, longitude: 77.45,
    image: '/mars/perseverance-backshell.webp', imageKind: 'dronePhoto', siteKind: 'landingRegion',
    sources: {
      mission: 'https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/spacecraft/getting_to_mars/',
      coordinates: 'https://www.giss.nasa.gov/tools/mars24/help/landers.html',
      photo: 'https://science.nasa.gov/resource/rovers-backshell-seen-from-the-air/',
    },
    copy: {
      ru: {
        name: "Парашют и кожух Perseverance",
        location: "Марс · кратер Езеро",
        intro: "Парашют замедлил спуск Perseverance, а защитный кожух удерживал его до отделения.",
        story: [
          "В феврале 2021 года кожух и парашют отделились при посадке в кратере Езеро и упали на поверхность.",
          "В апреле 2022 года Ingenuity сфотографировал их с воздуха для инженеров. Метка показывает район посадки миссии.",
        ],
      },
      en: {
        name: "Perseverance parachute and backshell",
        location: "Mars · Jezero Crater",
        intro: "The parachute slowed Perseverance, and the backshell supported it until separation.",
        story: [
          "In February 2021 the shell and parachute separated during the Jezero landing and fell to the surface.",
          "In April 2022 Ingenuity photographed them from the air for engineers. The marker shows the mission’s landing region.",
        ],
      },
      tg: {
        name: "Парашют ва рӯпӯши Perseverance",
        location: "Миррих · танӯраи Езеро",
        intro: "Парашют фуруди Perseverance-ро суст кард. Рӯпӯши муҳофизатӣ онро то ҷудошавӣ нигоҳ дошт.",
        story: [
          "Моҳи феврали соли 2021 рӯпӯш ва парашют ҳангоми фуруд дар танӯраи Езеро ҷудо шуда, ба сатҳ афтоданд.",
          "Моҳи апрели соли 2022 Ingenuity онҳоро аз ҳаво барои муҳандисон аксбардорӣ кард. Нишона минтақаи фуруди миссияро нишон медиҳад.",
        ],
      },
    },
  },
  mariner9: {
    world: 'mars', kind: 'orbiter',
    image: '/mars/mariner9.webp', imageKind: 'illustration', siteKind: 'marsOrbit',
    sources: {
      mission: 'https://science.nasa.gov/mission/mariner-9/',
      coordinates: 'https://science.nasa.gov/mission/mariner-9/',
      photo: 'https://science.nasa.gov/mission/mariner-9/',
    },
    copy: {
      ru: {
        name: "Mariner 9",
        location: "Марс · орбита Марса",
        intro: "Первый аппарат на орбите другой планеты помог составить карту Марса.",
        story: [
          "В 1971 году глобальная пылевая буря скрыла поверхность. Когда пыль осела, камеры засняли вулканы, каньоны и оба спутника Марса.",
          "Последний сеанс связи состоялся в октябре 1972 года. Аппарат оставили на марсианской орбите.",
        ],
      },
      en: {
        name: "Mariner 9",
        location: "Mars · Mars orbit",
        intro: "The first spacecraft to orbit another planet helped map Mars.",
        story: [
          "A global dust storm hid the surface in 1971. Once the dust settled, the cameras captured volcanoes, canyons and both Martian moons.",
          "Last contact came in October 1972. The spacecraft was left in Mars orbit.",
        ],
      },
      tg: {
        name: "Mariner 9",
        location: "Миррих · мадори Миррих",
        intro: "Аввалин дастгоҳ дар мадори сайёраи дигар ба тартиб додани харитаи Миррих кумак кард.",
        story: [
          "Соли 1971 тӯфони ғубор сатҳи сайёраро пӯшонд. Пас аз фурӯ нишастани ғубор камераҳо вулқонҳо, дараҳо ва ҳар ду радифи Миррихро акс гирифтанд.",
          "Тамоси охирин моҳи октябри соли 1972 буд. Дастгоҳ дар мадори Миррих гузошта шуд.",
        ],
      },
    },
  },
  "mars-global-surveyor": {
    world: 'mars', kind: 'orbiter',
    image: '/mars/mars-global-surveyor.webp', imageKind: 'illustration', siteKind: 'marsOrbit',
    sources: {
      mission: 'https://science.nasa.gov/mission/mars-global-surveyor/',
      coordinates: 'https://science.nasa.gov/mission/mars-global-surveyor/',
      photo: 'https://science.nasa.gov/mission/mars-global-surveyor/',
    },
    copy: {
      ru: {
        name: "Mars Global Surveyor",
        location: "Марс · орбита Марса",
        intro: "Орбитальная станция измерила высоты на Марсе и обнаружила намагниченные участки коры.",
        story: [
          "Лазерный высотомер составил карту рельефа. Магнитометр помог выяснить, что в прошлом у планеты было глобальное магнитное поле.",
          "Связь пропала в ноябре 2006 года. Восстановить её не удалось.",
        ],
      },
      en: {
        name: "Mars Global Surveyor",
        location: "Mars · Mars orbit",
        intro: "The orbiter mapped Martian elevations and found magnetized regions of the crust.",
        story: [
          "Its laser altimeter mapped the terrain. Its magnetometer helped establish that Mars once had a global magnetic field.",
          "Contact was lost in November 2006 and could not be restored.",
        ],
      },
      tg: {
        name: "Mars Global Surveyor",
        location: "Миррих · мадори Миррих",
        intro: "Истгоҳи мадорӣ баландии сатҳи Миррихро чен кард ва қисмҳои магнитноки қишрро ёфт.",
        story: [
          "Баландисанҷи лазерӣ харитаи релефро тартиб дод. Магнитсанҷ нишон дод, ки Миррих дар гузашта майдони магнитии саросарӣ дошт.",
          "Иртибот моҳи ноябри соли 2006 қатъ шуд ва барқарор нагардид.",
        ],
      },
    },
  },
  phobos2: {
    world: 'mars', kind: 'orbiter',
    image: '/mars/phobos2.webp', imageKind: 'phobosPhoto', siteKind: 'marsOrbit',
    sources: {
      mission: 'https://www.nasa.gov/history/25-years-of-continuous-robotic-mars-exploration-from-pathfinder-to-perseverance/',
      coordinates: 'https://www.jpl.nasa.gov/news/press_kits/insight/landing/appendix/history/',
      photo: 'https://science.nasa.gov/photojournal/phobos/',
    },
    copy: {
      ru: {
        name: "Фобос-2",
        location: "Марс · район орбиты Фобоса",
        intro: "Советский зонд исследовал Марс и его крупнейший спутник.",
        story: [
          "В 1989 году аппарат вышел на орбиту Марса, передал снимки Фобоса и измерял свойства его поверхности.",
          "Связь оборвалась в марте 1989 года до высадки приборов на Фобос. На снимке показан спутник, к которому направлялся зонд.",
        ],
      },
      en: {
        name: "Phobos 2",
        location: "Mars · near the orbit of Phobos",
        intro: "The Soviet probe studied Mars and its largest moon.",
        story: [
          "In 1989 it entered Mars orbit, returned images of Phobos and measured properties of its surface.",
          "Contact ended in March 1989 before the Phobos landers were deployed. The image shows the moon the probe was approaching.",
        ],
      },
      tg: {
        name: "Фобос-2",
        location: "Миррих · наздикии мадори Фобос",
        intro: "Зонди шӯравӣ Миррих ва бузургтарин радифи онро омӯхт.",
        story: [
          "Соли 1989 дастгоҳ ба мадори Миррих баромад, аксҳои Фобосро фиристод ва хусусиятҳои сатҳи онро чен кард.",
          "Иртибот моҳи марти соли 1989, пеш аз фуровардани асбобҳо ба Фобос, қатъ шуд. Дар акс радифе дида мешавад, ки зонд ба он наздик мешуд.",
        ],
      },
    },
  },
  maven: {
    world: 'mars', kind: 'orbiter',
    image: '/mars/maven.webp', imageKind: 'illustration', siteKind: 'marsOrbit',
    sources: {
      mission: 'https://www.nasa.gov/news-release/nasa-says-farewell-to-maven-mars-mission-hosts-media-call-today/',
      coordinates: 'https://science.nasa.gov/mission/maven/',
      photo: 'https://science.nasa.gov/mission/maven/',
    },
    copy: {
      ru: {
        name: "MAVEN",
        location: "Марс · орбита Марса",
        intro: "Станция исследовала, как Марс терял атмосферу под действием солнечного ветра.",
        story: [
          "После выхода на орбиту в 2014 году MAVEN измерял частицы и поля в верхней атмосфере. Эти данные помогли понять, как менялся климат Марса.",
          "NASA завершило миссию после потери связи с аппаратом. На иллюстрации показано, как солнечная буря уносит ионы из атмосферы.",
        ],
      },
      en: {
        name: "MAVEN",
        location: "Mars · Mars orbit",
        intro: "The orbiter studied how the solar wind stripped atmosphere from Mars.",
        story: [
          "After reaching orbit in 2014, MAVEN measured particles and fields in the upper atmosphere. The data helped explain how the Martian climate changed.",
          "NASA ended the mission after losing contact with the spacecraft. The illustration shows a solar storm stripping ions from the atmosphere.",
        ],
      },
      tg: {
        name: "MAVEN",
        location: "Миррих · мадори Миррих",
        intro: "Истгоҳ омӯхт, ки бодҳои офтобӣ чӣ гуна атмосфераи Миррихро тунук карданд.",
        story: [
          "Пас аз расидан ба мадор дар соли 2014 MAVEN зарраҳо ва майдонҳоро дар қабатҳои болоии атмосфера чен кард. Маълумот ба фаҳмидани тағйирёбии иқлими Миррих кумак кард.",
          "NASA пас аз қатъи иртибот бо дастгоҳ миссияро анҷом дод. Тасвир нишон медиҳад, ки тӯфони офтобӣ чӣ гуна ионҳоро аз атмосфера мебарад.",
        ],
      },
    },
  },
} as const;
