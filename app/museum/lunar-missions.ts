const coordinates = 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html';

export const lunarMissions = {
  surveyor1: {
    world: 'moon', kind: 'lander', latitude: -2.4745, longitude: -43.3398,
    image: '/lunar/surveyor1.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/mission/surveyor-1/',
      coordinates,
      photo: 'https://lroc.im-ldi.com/featured_sites/#surveyor-landing-sites',
    },
    copy: {
      ru: {
        name: "Surveyor 1",
        location: "Луна · Океан Бурь",
        intro: "Первый американский аппарат, который мягко сел на Луну.",
        story: [
          "В июне 1966 года Surveyor 1 испытал автоматическую посадку и передал более 11 тысяч снимков. По ним учёные изучали камни и рельеф вокруг станции.",
          "Основная программа закончилась в июле 1966 года. Связь со станцией, оставшейся на месте посадки, поддерживали до января 1967 года.",
        ],
      },
      en: {
        name: "Surveyor 1",
        location: "Moon · Ocean of Storms",
        intro: "The first American spacecraft to make a soft landing on the Moon.",
        story: [
          "In June 1966, Surveyor 1 tested automated landing and transmitted more than 11,000 images. Scientists used them to study rocks and terrain around the lander.",
          "The main mission ended in July 1966. Contact with the spacecraft at its landing site continued until January 1967.",
        ],
      },
      tg: {
        name: "Surveyor 1",
        location: "Моҳ · Уқёнуси Тӯфонҳо",
        intro: "Аввалин дастгоҳи амрикоӣ, ки ба рӯйи Моҳ нарм фуруд омад.",
        story: [
          "Моҳи июни соли 1966 Surveyor 1 фуруди худкорро санҷид ва беш аз 11 ҳазор акс фиристод. Олимон бо ёрии онҳо сангҳо ва релефи атрофи истгоҳро омӯхтанд.",
          "Барномаи асосӣ моҳи июли соли 1966 анҷом ёфт. Иртибот бо истгоҳе, ки дар маҳалли фуруд монд, то январи соли 1967 идома дошт.",
        ],
      },
    },
  },
  surveyor5: {
    world: 'moon', kind: 'lander', latitude: 1.4551, longitude: 23.1943,
    image: '/lunar/surveyor5.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/mission/surveyor-5/',
      coordinates,
      photo: 'https://lroc.im-ldi.com/featured_sites/#surveyor-landing-sites',
    },
    copy: {
      ru: {
        name: "Surveyor 5",
        location: "Луна · Море Спокойствия",
        intro: "Станция измерила химический состав лунного грунта прямо на месте посадки.",
        story: [
          "В сентябре 1967 года аппарат опустил на грунт прибор с источником альфа-частиц. Измерения показали, что состав грунта близок к базальту, породе вулканического происхождения.",
          "Станция осталась в небольшом кратере в Море Спокойствия. Последние данные поступили в декабре 1967 года.",
        ],
      },
      en: {
        name: "Surveyor 5",
        location: "Moon · Sea of Tranquility",
        intro: "This lander measured the chemical composition of lunar soil at its landing site.",
        story: [
          "In September 1967, the spacecraft lowered an instrument with an alpha-particle source onto the soil. Its measurements showed a composition similar to basalt, a volcanic rock.",
          "The spacecraft stayed in a small crater in the Sea of Tranquility. It sent its last data in December 1967.",
        ],
      },
      tg: {
        name: "Surveyor 5",
        location: "Моҳ · Баҳри Оромӣ",
        intro: "Ин истгоҳ таркиби кимиёвии хоки Моҳро дар маҳалли фуруд чен кард.",
        story: [
          "Моҳи сентябри соли 1967 дастгоҳ асбоби дорои манбаи зарраҳои алфаро ба хок фаровард. Ченкуниҳо нишон доданд, ки таркиби хок ба базалт, яъне ҷинси кӯҳии вулқонӣ, монанд аст.",
          "Истгоҳ дар танӯраи хурде дар Баҳри Оромӣ монд. Маълумоти охирин моҳи декабри соли 1967 расид.",
        ],
      },
    },
  },
  surveyor6: {
    world: 'moon', kind: 'lander', latitude: 0.4742, longitude: -1.4275,
    image: '/lunar/surveyor6.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/mission/surveyor-6/',
      coordinates,
      photo: 'https://lroc.im-ldi.com/featured_sites/#surveyor-landing-sites',
    },
    copy: {
      ru: {
        name: "Surveyor 6",
        location: "Луна · Центральный Залив",
        intro: "Аппарат впервые выполнил управляемый перелёт над поверхностью Луны.",
        story: [
          "Станция села в ноябре 1967 года и измерила химический состав грунта. Через неделю она включила двигатели и перелетела примерно на 2,5 метра.",
          "Снимки до и после перелёта позволили рассмотреть поверхность с двух точек. Метка показывает положение станции, оставшейся на Луне после этого манёвра.",
        ],
      },
      en: {
        name: "Surveyor 6",
        location: "Moon · Central Bay",
        intro: "This spacecraft made the first powered hop on the lunar surface.",
        story: [
          "The lander touched down in November 1967 and measured the soil’s chemical composition. A week later, it fired its engines and moved about 2.5 meters.",
          "Images taken before and after the hop showed the surface from two viewpoints. The marker shows where the spacecraft remained after the maneuver.",
        ],
      },
      tg: {
        name: "Surveyor 6",
        location: "Моҳ · Халиҷи Марказӣ",
        intro: "Ин дастгоҳ аввалин ҷаҳиши идорашавандаро дар рӯйи Моҳ анҷом дод.",
        story: [
          "Истгоҳ моҳи ноябри соли 1967 фуруд омад ва таркиби кимиёвии хокро чен кард. Пас аз як ҳафта муҳаррикҳояшро ба кор андохта, тақрибан 2,5 метр ҷой иваз кард.",
          "Аксҳои пеш ва пас аз ҷаҳиш сатҳро аз ду нуқта нишон доданд. Нишона ҷойи истгоҳро пас аз ин ҳаракат нишон медиҳад.",
        ],
      },
    },
  },
  surveyor7: {
    world: 'moon', kind: 'lander', latitude: -40.9812, longitude: -11.5127,
    image: '/lunar/surveyor7.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://www.jpl.nasa.gov/missions/surveyor-7/',
      coordinates,
      photo: 'https://lroc.im-ldi.com/featured_sites/#surveyor-landing-sites',
    },
    copy: {
      ru: {
        name: "Surveyor 7",
        location: "Луна · окрестности кратера Тихо",
        intro: "Последний Surveyor исследовал грунт лунных возвышенностей.",
        story: [
          "В январе 1968 года станция села у кратера Тихо. Анализ грунта показал меньше железа, чем в образцах, которые предыдущие Surveyor исследовали в лунных морях.",
          "Аппарат возобновил работу после лунной ночи. Он прекратил передачу в феврале 1968 года и остался у Тихо.",
        ],
      },
      en: {
        name: "Surveyor 7",
        location: "Moon · near Tycho crater",
        intro: "The final Surveyor studied soil in the lunar highlands.",
        story: [
          "In January 1968, the spacecraft landed near Tycho crater. Its soil analysis found less iron than earlier Surveyors had measured in the lunar maria.",
          "The lander resumed operations after the lunar night. It stopped transmitting in February 1968 and remained near Tycho.",
        ],
      },
      tg: {
        name: "Surveyor 7",
        location: "Моҳ · атрофи танӯраи Тихо",
        intro: "Охирин дастгоҳи Surveyor хоки баландкӯҳҳои Моҳро омӯхт.",
        story: [
          "Моҳи январи соли 1968 истгоҳ дар назди танӯраи Тихо фуруд омад. Дар хоки ин маҳал назар ба хокҳое, ки дастгоҳҳои пешинаи Surveyor дар баҳрҳои Моҳ санҷида буданд, оҳан камтар буд.",
          "Дастгоҳ пас аз шаби моҳӣ дубора ба кор даромад. Моҳи феврали соли 1968 фиристодани маълумотро қатъ кард ва дар назди Тихо монд.",
        ],
      },
    },
  },
  luna16: {
    world: 'moon', kind: 'lander', latitude: -0.5137, longitude: 56.3638,
    image: '/lunar/luna16.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/wp-content/uploads/2023/09/DSC_monograph24.pdf',
      coordinates,
      photo: 'https://lroc.im-ldi.com/featured_sites/#luna-landing-sites',
    },
    copy: {
      ru: {
        name: "Луна-16",
        location: "Луна · Море Изобилия",
        intro: "Первая автоматическая станция, доставившая лунный грунт на Землю.",
        story: [
          "В сентябре 1970 года бур станции собрал 101 грамм грунта. Образец из Моря Изобилия позволил сравнить породы этого района с образцами, доставленными экипажами Apollo.",
          "Капсула с грунтом вернулась на Землю, а посадочная ступень и бур остались на Луне.",
        ],
      },
      en: {
        name: "Luna 16",
        location: "Moon · Sea of Fertility",
        intro: "The first robotic spacecraft to return lunar soil to Earth.",
        story: [
          "In September 1970, the lander’s drill collected 101 grams of soil. The sample from the Sea of Fertility let scientists compare rocks from this region with those returned by Apollo crews.",
          "The sample capsule returned to Earth. The descent stage and drill stayed on the Moon.",
        ],
      },
      tg: {
        name: "Луна-16",
        location: "Моҳ · Баҳри Фаровонӣ",
        intro: "Аввалин истгоҳи худкоре, ки хоки Моҳро ба Замин овард.",
        story: [
          "Моҳи сентябри соли 1970 пармаи истгоҳ 101 грамм хок ҷамъ кард. Намуна аз Баҳри Фаровонӣ ба олимон имкон дод, ки ҷинсҳои ин минтақаро бо намунаҳои овардаи ҳайатҳои Apollo муқоиса кунанд.",
          "Капсулаи дорои хок ба Замин баргашт. Зинаи фуруд ва парма дар Моҳ монданд.",
        ],
      },
    },
  },
  luna20: {
    world: 'moon', kind: 'lander', latitude: 3.7863, longitude: 56.6242,
    image: '/lunar/luna20.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/wp-content/uploads/2023/09/DSC_monograph24.pdf',
      coordinates,
      photo: 'https://lroc.im-ldi.com/featured_sites/#luna-landing-sites',
    },
    copy: {
      ru: {
        name: "Луна-20",
        location: "Луна · возвышенность Аполлония",
        intro: "Станция доставила образцы с возвышенности между двумя лунными морями.",
        story: [
          "В феврале 1972 года аппарат пробурил грунт в гористой местности между Морем Изобилия и Морем Кризисов. На Землю доставили около 50 граммов материала, по которому изучали породы возвышенностей.",
          "Взлётная ступень отправила образцы к Земле. Посадочная ступень находится там, где станция взяла грунт.",
        ],
      },
      en: {
        name: "Luna 20",
        location: "Moon · Apollonius highlands",
        intro: "The spacecraft returned samples from highlands between two lunar seas.",
        story: [
          "In February 1972, the lander drilled into rocky terrain between the Sea of Fertility and the Sea of Crises. About 50 grams reached Earth, giving scientists material to study highland rocks.",
          "The ascent stage sent the samples toward Earth. The descent stage remains at the sampling site.",
        ],
      },
      tg: {
        name: "Луна-20",
        location: "Моҳ · баландии Аполлоний",
        intro: "Истгоҳ аз баландии байни ду баҳри Моҳ намуна овард.",
        story: [
          "Моҳи феврали соли 1972 дастгоҳ дар минтақаи кӯҳистони байни Баҳри Фаровонӣ ва Баҳри Буҳронҳо хокро парма кард. Тақрибан 50 грамм мавод ба Замин расид ва олимон бо он ҷинсҳои баландкӯҳро омӯхтанд.",
          "Зинаи болоӣ намунаҳоро ба сӯи Замин фиристод. Зинаи фуруд дар маҳалли гирифтани намуна монд.",
        ],
      },
    },
  },
  luna24: {
    world: 'moon', kind: 'lander', latitude: 12.7142, longitude: 62.2129,
    image: '/lunar/luna24.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://science.nasa.gov/wp-content/uploads/2023/09/DSC_monograph24.pdf',
      coordinates,
      photo: 'https://lroc.im-ldi.com/featured_sites/#luna-landing-sites',
    },
    copy: {
      ru: {
        name: "Луна-24",
        location: "Луна · Море Кризисов",
        intro: "Бур станции взял образец грунта из-под поверхности лунного моря.",
        story: [
          "В августе 1976 года станция пробурила грунт в Море Кризисов на глубину около двух метров. На Землю доставили около 170 граммов материала, сохранившего последовательность слоёв.",
          "Капсула вернулась на Землю, а посадочная ступень с буровой установкой осталась на месте отбора пробы.",
        ],
      },
      en: {
        name: "Luna 24",
        location: "Moon · Sea of Crises",
        intro: "The lander’s drill collected a sample from beneath the surface of a lunar sea.",
        story: [
          "In August 1976, the spacecraft drilled about two meters into the soil of the Sea of Crises. It returned about 170 grams of material that preserved the sequence of layers.",
          "The capsule returned to Earth. The descent stage and drilling equipment stayed at the sampling site.",
        ],
      },
      tg: {
        name: "Луна-24",
        location: "Моҳ · Баҳри Буҳронҳо",
        intro: "Пармаи истгоҳ аз зери сатҳи баҳри Моҳ намуна гирифт.",
        story: [
          "Моҳи августи соли 1976 истгоҳ хоки Баҳри Буҳронҳоро то умқи тақрибан ду метр парма кард. Ба Замин тақрибан 170 грамм мавод расид, ки пайдарпаии қабатҳои хокро нигоҳ дошта буд.",
          "Капсула ба Замин баргашт. Зинаи фуруд бо дастгоҳи пармакунӣ дар маҳалли гирифтани намуна монд.",
        ],
      },
    },
  },
  apollo14: {
    world: 'moon', kind: 'lander', latitude: -3.64589, longitude: -17.47194,
    image: '/lunar/apollo14.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://www.nasa.gov/missions/apollo/apollo-14-mission-details/',
      coordinates,
      photo: 'https://lroc.im-ldi.com/featured_sites/#apollo-landing-sites',
    },
    copy: {
      ru: {
        name: "Apollo 14 · Antares",
        location: "Луна · Фра-Мауро",
        intro: "Посадочная ступень Antares осталась у места, где астронавты изучали обломки древнего удара.",
        story: [
          "В феврале 1971 года Алан Шепард и Эдгар Митчелл высадились в районе Фра-Мауро. Они установили сейсмометр и собрали около 42 килограммов образцов.",
          "Взлётная ступень вернула экипаж на лунную орбиту. Нижняя ступень осталась на поверхности.",
        ],
      },
      en: {
        name: "Apollo 14 · Antares",
        location: "Moon · Fra Mauro",
        intro: "Antares’s descent stage remains where astronauts studied debris from an ancient impact.",
        story: [
          "Alan Shepard and Edgar Mitchell landed at Fra Mauro in February 1971. They deployed a seismometer and collected about 42 kilograms of samples.",
          "The ascent stage returned the crew to lunar orbit. The descent stage stayed on the surface.",
        ],
      },
      tg: {
        name: "Apollo 14 · Antares",
        location: "Моҳ · Фра-Мауро",
        intro: "Зинаи фуруди Antares дар ҷое монд, ки кайҳоннавардон пораҳои аз бархӯрди қадимӣ боқимондаро омӯхтанд.",
        story: [
          "Моҳи феврали соли 1971 Алан Шепард ва Эдгар Митчелл дар минтақаи Фра-Мауро фуруд омаданд. Онҳо сейсмометр насб карданд ва тақрибан 42 килограмм намуна ҷамъ оварданд.",
          "Зинаи болоӣ ҳайатро ба мадори Моҳ баргардонд. Зинаи фуруд дар рӯйи Моҳ монд.",
        ],
      },
    },
  },
  change3: {
    world: 'moon', kind: 'combined', latitude: 44.1214, longitude: -19.5116,
    image: '/lunar/change3.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://english.ihep.cas.cn/nw/han/y16/201608/t20160815_296709.html',
      coordinates,
      photo: 'https://lroc.im-ldi.com/images/637',
    },
    copy: {
      ru: {
        name: "Чанъэ-3 и Юйту",
        location: "Луна · Море Дождей",
        intro: "Китайская станция доставила на Луну шестиколёсный ровер Юйту.",
        story: [
          "В декабре 2013 года Юйту выехал с платформы «Чанъэ-3». Измерения химического состава грунта помогли исследователям описать местный базальт.",
          "Юйту завершил работу в 2016 году, а посадочная станция прекратила научные наблюдения в 2019 году. Оба аппарата остались в Море Дождей. Метка показывает положение посадочной станции.",
        ],
      },
      en: {
        name: "Chang’e 3 and Yutu",
        location: "Moon · Sea of Rains",
        intro: "The Chinese lander delivered the six-wheeled Yutu rover to the Moon.",
        story: [
          "In December 2013, Yutu rolled off the Chang’e 3 platform. Measurements of the soil’s chemical composition helped researchers characterize the local basalt.",
          "Yutu retired in 2016, and the lander stopped scientific observations in 2019. Both spacecraft stayed in the Sea of Rains. The marker shows the position of the lander.",
        ],
      },
      tg: {
        name: "Чанъэ-3 ва Юйту",
        location: "Моҳ · Баҳри Боронҳо",
        intro: "Истгоҳи чинӣ моҳгарди шашчархаи Юйтуро ба Моҳ расонд.",
        story: [
          "Моҳи декабри соли 2013 Юйту аз платформаи Чанъэ-3 поён фаромад. Ченкунии таркиби кимиёвии хок ба муҳаққиқон кумак кард, ки хусусиятҳои базалти маҳаллиро муайян кунанд.",
          "Юйту соли 2016 корашро анҷом дод ва истгоҳи фуруд соли 2019 мушоҳидаҳои илмиро қатъ кард. Ҳар ду дастгоҳ дар Баҳри Боронҳо монданд. Нишона ҷойи истгоҳи фурудро нишон медиҳад.",
        ],
      },
    },
  },
  vikram: {
    world: 'moon', kind: 'lander', latitude: -69.3741, longitude: 32.32,
    image: '/lunar/vikram.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://www.isro.gov.in/ISRO_EN/Chandrayaan3.html',
      coordinates,
      photo: 'https://lroc.im-ldi.com/images/1314',
    },
    copy: {
      ru: {
        name: "Chandrayaan-3 · Vikram",
        location: "Луна · южная полярная область",
        intro: "Посадочная станция Vikram доставила на Луну индийский ровер Pragyan.",
        story: [
          "В августе 2023 года станция села примерно в 600 километрах от южного полюса. Её прибор ChaSTE измерил, как меняется температура с глубиной в верхнем слое грунта.",
          "Перед лунной ночью аппараты перевели в спящий режим. Метка указывает на станцию Vikram, оставшуюся на месте посадки.",
        ],
      },
      en: {
        name: "Chandrayaan-3 · Vikram",
        location: "Moon · south polar region",
        intro: "The Vikram lander carried India’s Pragyan rover to the Moon.",
        story: [
          "In August 2023, Vikram landed about 600 kilometers from the south pole. Its ChaSTE instrument measured how temperature varied with depth in the upper layer of soil.",
          "The spacecraft were put into sleep mode ahead of the lunar night. The marker shows Vikram, which remains at the landing site.",
        ],
      },
      tg: {
        name: "Chandrayaan-3 · Vikram",
        location: "Моҳ · минтақаи қутби ҷанубӣ",
        intro: "Дастгоҳи фуруди Vikram моҳгарди ҳиндии Pragyan-ро ба Моҳ расонд.",
        story: [
          "Моҳи августи соли 2023 истгоҳ тақрибан 600 километр дуртар аз қутби ҷанубӣ фуруд омад. Асбоби ChaSTE тағйирёбии ҳароратро вобаста ба умқ дар қабати болоии хок чен кард.",
          "Пеш аз шаби моҳӣ дастгоҳҳоро ба ҳолати хоб гузаронданд. Нишона ҷойи Vikram-ро нишон медиҳад, ки дар маҳалли фуруд монд.",
        ],
      },
    },
  },
  slim: {
    world: 'moon', kind: 'lander', latitude: -13.316, longitude: 25.251,
    image: '/lunar/slim.webp', imageKind: 'lrocPhoto', siteKind: 'position',
    sources: {
      mission: 'https://www.isas.jaxa.jp/en/topics/files/SLIM-press-briefing-20241226.pdf',
      coordinates,
      photo: 'https://lroc.im-ldi.com/images/1358',
    },
    copy: {
      ru: {
        name: "SLIM",
        location: "Луна · окрестности кратера Сиоли",
        intro: "Японская станция испытала технологию высокоточной посадки на Луне.",
        story: [
          "В январе 2024 года аппарат сел возле кратера Сиоли. Его камера изучила спектры окружающих камней, чтобы определить их минеральный состав.",
          "Станция пережила три лунные ночи. JAXA завершило работу в августе 2024 года, и аппарат остался у кратера.",
        ],
      },
      en: {
        name: "SLIM",
        location: "Moon · near Shioli crater",
        intro: "The Japanese lander demonstrated precision landing on the Moon.",
        story: [
          "In January 2024, the spacecraft landed near Shioli crater. Its camera studied the spectra of nearby rocks to determine their mineral composition.",
          "The lander survived three lunar nights. JAXA ended operations in August 2024, and the spacecraft remains near the crater.",
        ],
      },
      tg: {
        name: "SLIM",
        location: "Моҳ · атрофи танӯраи Сиоли",
        intro: "Истгоҳи ҷопонӣ технологияи фуруди дақиқро дар Моҳ санҷид.",
        story: [
          "Моҳи январи соли 2024 дастгоҳ дар наздикии танӯраи Сиоли фуруд омад. Камераи он тайфи сангҳои атрофро омӯхт, то таркиби минералии онҳоро муайян кунад.",
          "Истгоҳ се шаби моҳиро паси сар кард. JAXA моҳи августи соли 2024 корро анҷом дод ва дастгоҳ дар наздикии танӯра монд.",
        ],
      },
    },
  },
} as const;
