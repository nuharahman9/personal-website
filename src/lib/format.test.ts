import { describe, expect, it } from 'vitest';
import { formatDay, formatMonth, formatRange, sortByDateDesc } from './format';

describe('format', () => {
  it('formats months in UTC (no off-by-one in negative-offset zones)', () => {
    expect(formatMonth('2024-01')).toBe('Jan 2024');
    expect(formatDay('2024-03-01')).toBe('Mar 1, 2024');
  });

  it('renders open-ended ranges as Present', () => {
    expect(formatRange('2023-06')).toBe('Jun 2023 — Present');
    expect(formatRange('2021-02', '2023-05')).toBe('Feb 2021 — May 2023');
  });

  it('throws on invalid dates instead of rendering "Invalid Date"', () => {
    expect(() => formatMonth('2024-13')).toThrow(RangeError);
  });

  it('sorts newest first without mutating input', () => {
    const input = [{ date: '2024-01-01' }, { date: '2025-06-01' }, { date: '2024-12-31' }] as const;
    const out = sortByDateDesc(input);
    expect(out.map((a) => a.date)).toEqual(['2025-06-01', '2024-12-31', '2024-01-01']);
    expect(input[0].date).toBe('2024-01-01');
  });
});
