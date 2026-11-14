import { catalogExpansion } from './catalog-expansion';
import { hubble } from './hubble';
import { additionalMissions } from './additional-missions';
import { lunokhod } from './lunokhod';
import { marsMissions } from './mars-missions';
import { lunarMissions } from './lunar-missions';

const marsCoordinates = 'https://www-robotics.jpl.nasa.gov/media/documents/05pers_mer_JIQgXbW.pdf';

export const missions = {
  ...additionalMissions,
  ...catalogExpansion,
  hubble,
  lunokhod: { kind: 'rover', ...lunokhod, world: 'moon', image: '/lunokhod-1.webp', imageKind: 'model', siteKind: 'position' },
  apollo: { kind: 'lander',
    world: 'moon', latitude: 0.67409, longitude: 23.47298,
    image: '/apollo.webp', imageKind: 'archive', siteKind: 'position',
    sources: {
      mission: 'https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11ov.html',
      coordinates: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloland.html',
      photo: 'https://eol.jsc.nasa.gov/SearchPhotos/photo.pl?frame=5927&mission=AS11&roll=40',
    },
    copy: {
      ru: { name: 'Apollo 11', location: 'Луна · Море Спокойствия', intro: 'Посадочная ступень модуля Eagle осталась там, где люди впервые ступили на Луну.', story: [
        '20 июля 1969 года Eagle доставил Нила Армстронга и Базза Олдрина в Море Спокойствия. Они собрали образцы грунта и установили научные приборы, в том числе лазерный отражатель.',
        'Когда астронавты взлетели с Луны, верхняя ступень отделилась. Нижняя послужила стартовой площадкой и осталась на поверхности.',
      ] },
      en: { name: 'Apollo 11', location: 'Moon · Sea of Tranquility', intro: 'Eagle’s descent stage remains where humans first set foot on the Moon.', story: [
        'On July 20, 1969, Eagle carried Neil Armstrong and Buzz Aldrin to the Sea of Tranquility. They collected lunar samples and set up scientific instruments, including a laser reflector.',
        'When they lifted off, the ascent stage separated. The descent stage served as its launch platform and stayed on the Moon.',
      ] },
      tg: { name: 'Apollo 11', location: 'Моҳ · Баҳри Оромӣ', intro: 'Зинаи фуруди модули Eagle дар ҷое боқӣ монд, ки инсон бори аввал ба рӯйи Моҳ қадам гузошт.', story: [
        '20 июли соли 1969 Eagle Нил Армстронг ва Базз Олдринро ба Баҳри Оромӣ расонд. Онҳо намунаҳои хоки Моҳро ҷамъ карда, асбобҳои илмӣ, аз ҷумла бозтобдиҳандаи лазерӣ, насб карданд.',
        'Ҳангоми парвоз аз Моҳ зинаи болоӣ ҷудо шуд. Зинаи поёнӣ ҳамчун майдончаи парвоз хизмат кард ва дар рӯйи Моҳ монд.',
      ] },
    },
  },
  spirit: { kind: 'rover',
    world: 'mars', latitude: -14.5692, longitude: 175.4729,
    image: '/spirit.webp', imageKind: 'illustration', siteKind: 'landing',
    sources: {
      mission: 'https://science.nasa.gov/mission/mer-spirit/', coordinates: marsCoordinates,
      photo: 'https://science.nasa.gov/resource/mars-exploration-rovers-artists-concept/',
    },
    copy: {
      ru: { name: 'Spirit', location: 'Марс · кратер Гусева', intro: 'Марсоход нашёл почти чистый кремнезём, который мог образоваться возле древних горячих источников.', story: [
        'Spirit сел в кратере Гусева в январе 2004 года. Миссию рассчитывали на 90 марсианских суток, а аппарат передавал данные более шести земных лет.',
        'В 2009 году колёса увязли в рыхлом грунте у плато Хоум-Плейт. Spirit остался там. Последний сигнал пришёл 22 марта 2010 года, а попытки восстановить связь завершились в мае 2011 года.',
      ] },
      en: { name: 'Spirit', location: 'Mars · Gusev Crater', intro: 'Spirit found nearly pure silica that may have formed around ancient hot springs.', story: [
        'Spirit landed in Gusev Crater in January 2004. It was designed for 90 Martian days and sent back data for more than six Earth years.',
        'In 2009 its wheels became trapped in soft soil near Home Plate, where the rover remains. Its last signal arrived on March 22, 2010. Recovery efforts ended in May 2011.',
      ] },
      tg: { name: 'Spirit', location: 'Миррих · танӯраи Гусев', intro: 'Spirit диоксиди силитсии қариб холисро ёфт, ки шояд дар назди чашмаҳои гарми қадимӣ пайдо шуда бошад.', story: [
        'Spirit моҳи январи соли 2004 дар танӯраи Гусев фуруд омад. Миссия барои 90 шабонарӯзи миррихӣ тарҳрезӣ шуда буд, вале дастгоҳ зиёда аз шаш соли заминӣ маълумот фиристод.',
        'Соли 2009 чархҳои он дар хоки нарми назди баландии Home Plate дармонданд. Дастгоҳ дар ҳамон ҷо боқӣ монд. Сигнали охирин 22 марти соли 2010 расид. Кӯшишҳои барқарор кардани иртибот моҳи майи соли 2011 анҷом ёфтанд.',
      ] },
    },
  },
  opportunity: { kind: 'rover',
    world: 'mars', latitude: -1.9462, longitude: 354.4734,
    image: '/opportunity.webp', imageKind: 'illustration', siteKind: 'landing',
    sources: {
      mission: 'https://science.nasa.gov/mission/mer-opportunity/', coordinates: marsCoordinates,
      photo: 'https://science.nasa.gov/resource/mars-exploration-rovers-rover-approaching-a-point-of-interest/',
    },
    copy: {
      ru: { name: 'Opportunity', location: 'Марс · плато Меридиана', intro: 'Марсоход проехал 45,16 км и нашёл в породах признаки того, что на Марсе когда-то была жидкая вода.', story: [
        'Opportunity сел на плато Меридиана в январе 2004 года. Он обнаружил породы, изменённые водой, и богатые гематитом шарики, которые команда прозвала «черникой».',
        'В 2018 году глобальная пылевая буря закрыла солнечный свет. Последний сигнал пришёл 10 июня, когда марсоход находился в долине Персеверанс. NASA объявило миссию завершённой 13 февраля 2019 года.',
      ] },
      en: { name: 'Opportunity', location: 'Mars · Meridiani Planum', intro: 'Opportunity drove 45.16 km and found evidence in rocks that liquid water once existed on Mars.', story: [
        'Opportunity landed in Meridiani Planum in January 2004. It found rocks altered by water and tiny hematite-rich spheres the team nicknamed “blueberries.”',
        'In 2018 a planet-wide dust storm blocked sunlight. Opportunity last transmitted from Perseverance Valley on June 10. NASA declared the mission complete on February 13, 2019.',
      ] },
      tg: { name: 'Opportunity', location: 'Миррих · ҳамвории Меридианӣ', intro: 'Opportunity 45,16 км роҳ тай кард ва дар сангҳо нишонаҳои мавҷудияти оби моеъро дар гузаштаи Миррих ёфт.', story: [
        'Opportunity моҳи январи соли 2004 дар ҳамвории Меридианӣ фуруд омад. Он сангҳои аз таъсири об тағйирёфта ва доначаҳои хурди бой аз гематитро ёфт.',
        'Соли 2018 тӯфони ғубор тамоми сайёраро фаро гирифт ва нури Офтобро баст. Сигнали охирин 10 июн аз водии Персеверанс расид. NASA 13 феврали соли 2019 анҷоми миссияро эълон кард.',
      ] },
    },
  },
  ...lunarMissions,
  ...marsMissions,
} as const;

export type MissionId = keyof typeof missions;
export const missionIds = Object.keys(missions) as MissionId[];
export const homepageMissionIds = missionIds.filter((id) =>
  missions[id].world !== 'space' && !Object.hasOwn(lunarMissions, id) && !Object.hasOwn(marsMissions, id),
);

// Each entry uses the shared telescope mesh. Positions are illustrative.
export const orbitExhibits = ([
  { id: 'hubble', position: [0.78, 0.18, 0.68] },
  { id: 'spitzer', position: [-0.94, -0.28, 0.54] },
] as const).slice(0, 6);

export const globeMissionIds = missionIds.filter((id) =>
  'latitude' in missions[id] || orbitExhibits.some((exhibit) => exhibit.id === id),
);
