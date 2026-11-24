import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useHashSection } from './useHashSection';

const ids = ['about', 'über'] as const;

afterEach(() => window.history.replaceState(null, '', '/'));

describe('useHashSection', () => {
  it('reads a known section from the initial hash', () => {
    window.history.replaceState(null, '', '/#about');
    const { result } = renderHook(() => useHashSection(ids));
    expect(result.current.activeId).toBe('about');
  });

  it('decodes encoded ids', () => {
    window.history.replaceState(null, '', `/#${encodeURIComponent('über')}`);
    const { result } = renderHook(() => useHashSection(ids));
    expect(result.current.activeId).toBe('über');
  });

  it.each(['/', '/#', '/#nope', '/#%E0'])('returns undefined for %s', (url) => {
    window.history.replaceState(null, '', url);
    const { result } = renderHook(() => useHashSection(ids));
    expect(result.current.activeId).toBeUndefined();
  });

  it('follows hashchange events', () => {
    const { result } = renderHook(() => useHashSection(ids));
    act(() => {
      window.history.replaceState(null, '', '/#about');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current.activeId).toBe('about');
  });

  it('close drops the hash but keeps path and query, adding a history entry', () => {
    window.history.replaceState(null, '', '/page?x=1#about');
    const { result } = renderHook(() => useHashSection(ids));
    const lengthBefore = window.history.length;
    act(() => result.current.close());
    expect(result.current.activeId).toBeUndefined();
    expect(`${window.location.pathname}${window.location.search}${window.location.hash}`).toBe(
      '/page?x=1',
    );
    expect(window.history.length).toBe(lengthBefore + 1);
  });
});
