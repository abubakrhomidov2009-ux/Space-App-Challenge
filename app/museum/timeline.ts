import type { MissionId } from './missions';
import type { Language } from './languages';

// How a mission stands now, and since when. The three endings are different things and are shown
// differently: contact lost (the spacecraft stopped answering), work ended (the operators closed
// the mission or the spacecraft finished), left behind (the crew or the return stage flew away and
// the rest stayed). Dates are UTC; a time is given only where the primary source states it.
export type Standing = 'lost' | 'ended' | 'left' | 'active' | 'placed';

export type Chapter = {
  standing: Standing;
  // Arrival: landing, or launch for orbiters.
  arrived: string;
  // The moment the standing began: last contact, end of work, or departure. Absent when it has not ended.
  since?: string;
  // Official closing of the mission, when it came after the last contact.
  closed?: string;
};

export const timeline: Record<MissionId, Chapter> = {
  surveyor1: { standing: 'ended', arrived: '1966-06-02T06:17:36Z', since: '1966-07-13' },
  surveyor: { standing: 'ended', arrived: '1967-04-20T00:04:53Z', since: '1967-05-04T00:04:00Z' },
  surveyor5: { standing: 'ended', arrived: '1967-09-11T00:46:44Z', since: '1967-12-17T04:30:00Z' },
  surveyor6: { standing: 'ended', arrived: '1967-11-10T01:01:06Z', since: '1967-12-14T19:14:00Z' },
  surveyor7: { standing: 'ended', arrived: '1968-01-10T01:05:36Z', since: '1968-02-21T12:24:00Z' },
  apollo: { standing: 'left', arrived: '1969-07-20', since: '1969-07-21' },
  apollo14: { standing: 'left', arrived: '1971-02-05', since: '1971-02-06' },
  apollo15: { standing: 'left', arrived: '1971-07-30', since: '1971-08-02' },
  apollo17: { standing: 'left', arrived: '1972-12-11', since: '1972-12-14' },
  luna16: { standing: 'left', arrived: '1970-09-20', since: '1970-09-21' },
  luna20: { standing: 'left', arrived: '1972-02-21', since: '1972-02-22' },
  luna24: { standing: 'left', arrived: '1976-08-18', since: '1976-08-19' },
  lunokhod: { standing: 'lost', arrived: '1970-11-17', since: '1971-09-14', closed: '1971-10-04' },
  change3: { standing: 'placed', arrived: '2013-12-14' },
  vikram: { standing: 'ended', arrived: '2023-08-23', since: '2023-09-04' },
  slim: { standing: 'ended', arrived: '2024-01-19', since: '2024-08-28' },
  spirit: { standing: 'lost', arrived: '2004-01-04', since: '2010-03-22', closed: '2011-05-25' },
  opportunity: { standing: 'lost', arrived: '2004-01-25', since: '2018-06-10', closed: '2019-02-13' },
  viking: { standing: 'lost', arrived: '1976-07-20', since: '1982-11-13' },
  pathfinder: { standing: 'lost', arrived: '1997-07-04', since: '1997-09-27' },
  insight: { standing: 'ended', arrived: '2018-11-26', since: '2022-12-15', closed: '2022-12-21' },
  hubble: { standing: 'active', arrived: '1990-04-24' },
  spitzer: { standing: 'ended', arrived: '2003-08-25', since: '2020-01-30' },
};

export function hasTime(date: string) {
  return date.includes('T');
}

export function parse(date: string) {
  return new Date(hasTime(date) ? date : `${date}T00:00:00Z`);
}

export function year(date: string) {
  return parse(date).getUTCFullYear();
}

export type Elapsed = { years: number; days: number; hours: number; minutes: number; seconds: number };

// Whole years first, then the days left over. Calendar years, so a leap day is not lost.
export function elapsed(from: string, now: Date): Elapsed {
  const start = parse(from);
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  const anniversary = (count: number) => new Date(Date.UTC(start.getUTCFullYear() + count, start.getUTCMonth(), start.getUTCDate(),
    start.getUTCHours(), start.getUTCMinutes(), start.getUTCSeconds()));
  if (anniversary(years) > now) years -= 1;
  const remainder = now.getTime() - anniversary(Math.max(0, years)).getTime();
  const total = Math.max(0, Math.floor(remainder / 1000));
  return {
    years: Math.max(0, years),
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const standingWords: Record<Language, Record<Standing, string>> = {
  ru: { lost: 'Связь потеряна', ended: 'Работа завершена', left: 'Оставлен на месте', active: 'Работает', placed: 'На месте с посадки' },
  en: { lost: 'Contact lost', ended: 'Work ended', left: 'Left behind', active: 'Still working', placed: 'In place since landing' },
  tg: { lost: 'Иртибот гум шуд', ended: 'Кор анҷом ёфт', left: 'Дар ҷой монд', active: 'Кор мекунад', placed: 'Аз лаҳзаи фуруд дар ҷой' },
};

export function standingLabel(standing: Standing, language: Language) {
  return standingWords[language][standing];
}

function russianPlural(count: number, forms: [string, string, string]) {
  const last = count % 10;
  const tens = count % 100;
  if (tens >= 11 && tens <= 14) return forms[2];
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}

export function unitWords(language: Language, value: Elapsed) {
  if (language === 'ru') {
    return {
      years: russianPlural(value.years, ['год', 'года', 'лет']),
      days: russianPlural(value.days, ['день', 'дня', 'дней']),
    };
  }
  if (language === 'tg') return { years: 'сол', days: 'рӯз' };
  return { years: value.years === 1 ? 'year' : 'years', days: value.days === 1 ? 'day' : 'days' };
}
