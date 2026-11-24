import type { IsoDate, YearMonth } from '../content/types';

// Pin to UTC: `new Date('2024-03')` is parsed as UTC midnight, so formatting
// in a local zone west of UTC would render the previous month/day.
const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const dayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

function parseUtc(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new RangeError(`Invalid date: "${value}"`);
  return date;
}

export const formatMonth = (value: YearMonth): string => monthFormatter.format(parseUtc(value));
export const formatDay = (value: IsoDate): string => dayFormatter.format(parseUtc(value));

export const formatRange = (start: YearMonth, end?: YearMonth): string =>
  `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;

/** Returns a new array, newest first. ISO strings sort lexicographically. */
export const sortByDateDesc = <T extends { date: IsoDate }>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => b.date.localeCompare(a.date));
