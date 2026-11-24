import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { site } from './content/site';
import { sections } from './sections/registry';
import { ACCENT_IMAGES } from './styles/accents';

const bandLinks = () =>
  within(screen.getByRole('navigation', { name: 'Sections' })).getAllByRole('link');

const navigateToHash = (hash: string) =>
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

const home = () => screen.getByRole('main').parentElement;

afterEach(() => window.history.replaceState(null, '', '/'));

describe('App: home', () => {
  it('renders the owner name as the single h1', () => {
    render(<App />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(site.name);
  });

  it('renders one colored band per registry section, in order', () => {
    render(<App />);
    const links = bandLinks();
    expect(links).toHaveLength(sections.length);
    sections.forEach(({ id, label, accent }, i) => {
      expect(links[i]).toHaveAttribute('href', `#${id}`);
      expect(links[i]).toHaveTextContent(label);
      expect(links[i]?.style.getPropertyValue('--item-color')).toBe(`var(--accent-${accent})`);
      expect(links[i]?.style.getPropertyValue('--item-image')).toBe(
        `url("${ACCENT_IMAGES[accent]}")`,
      );
    });
  });

  it('shows no section content until a band is opened', () => {
    render(<App />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(home()).not.toHaveAttribute('inert');
  });
});

describe('App: panels', () => {
  it('opens the section panel when the hash changes', () => {
    render(<App />);
    navigateToHash('#projects');
    const dialog = screen.getByRole('dialog', { name: 'projects' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByRole('button', { name: 'close' })).toHaveFocus();
    expect(home()).toHaveAttribute('inert');
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('opens directly from a deep link', () => {
    window.history.replaceState(null, '', '/#writing');
    render(<App />);
    expect(screen.getByRole('dialog', { name: 'writing' })).toBeInTheDocument();
  });

  it('ignores hashes that are not sections', () => {
    window.history.replaceState(null, '', '/#nope');
    render(<App />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes via the close button, clears the hash, and refocuses the band', () => {
    render(<App />);
    navigateToHash('#experience');
    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('');
    expect(home()).not.toHaveAttribute('inert');
    expect(document.documentElement.style.overflow).toBe('');
    expect(screen.getByRole('link', { name: 'experience' })).toHaveFocus();
  });

  it('closes on Escape', () => {
    render(<App />);
    navigateToHash('#about');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when history goes back to a hash-less URL', () => {
    render(<App />);
    navigateToHash('#recs');
    act(() => {
      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('marks external links in a panel as new-tab with safe rel', () => {
    render(<App />);
    navigateToHash('#contact');
    const dialog = screen.getByRole('dialog', { name: 'contact' });
    const external = within(dialog).getAllByRole('link', { name: /opens in new tab/i });
    expect(external.length).toBeGreaterThan(0);
    for (const link of external) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    }
  });
});
