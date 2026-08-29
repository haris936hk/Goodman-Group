import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SiteHeader } from './site-header';

const motionPreference = vi.hoisted(() => ({ reduced: false }));
const navigationState = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    useReducedMotion: () => motionPreference.reduced,
  };
});

afterEach(() => {
  document.body.style.overflow = '';
  motionPreference.reduced = false;
  navigationState.pathname = '/';
  vi.restoreAllMocks();
});

describe('SiteHeader', () => {
  it('closes with Escape and restores page scrolling', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    expect(document.body.style.overflow).toBe('hidden');
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Close navigation' }),
      ).toHaveFocus();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(
        screen.queryByRole('navigation', { name: 'Mobile navigation' }),
      ).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe('');
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus();
  });

  it('follows the rendered menu toggle state after resize', async () => {
    const user = userEvent.setup();
    let menuToggleDisplay = 'grid';
    const getComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const computedStyle = getComputedStyle(element);

      if (element instanceof HTMLElement && element.classList.contains('menu-toggle')) {
        Object.defineProperty(computedStyle, 'display', {
          configurable: true,
          value: menuToggleDisplay,
        });
      }

      return computedStyle;
    });

    render(<SiteHeader />);

    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(toggle);
    fireEvent.resize(window);

    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeInTheDocument();

    menuToggleDisplay = 'none';
    fireEvent.resize(window);

    await waitFor(() => {
      expect(
        screen.queryByRole('navigation', { name: 'Mobile navigation' }),
      ).not.toBeInTheDocument();
    });
    expect(toggle).not.toHaveFocus();
  });

  it('closes after selecting a mobile navigation destination', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Mobile navigation',
    });
    const companyLink = within(mobileNavigation).getByRole('link', {
      name: /Our Companies/,
    });

    companyLink.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    });

    await user.click(companyLink);

    await waitFor(() => {
      expect(
        screen.queryByRole('navigation', { name: 'Mobile navigation' }),
      ).not.toBeInTheDocument();
    });
  });

  it('opens without staged movement when reduced motion is requested', async () => {
    const user = userEvent.setup();
    motionPreference.reduced = true;

    render(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeVisible();
  });

  it('contains focus within the open dialog and makes page content inert', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SiteHeader />
        <main>
          <a href="#content">Page content</a>
        </main>
        <footer>Footer</footer>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    const dialog = screen.getByRole('dialog', { name: 'Site navigation' });
    const closeButton = within(dialog).getByRole('button', {
      name: 'Close navigation',
    });
    const links = within(dialog).getAllByRole('link');

    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(document.querySelector('header')).toHaveProperty('inert', true);
    expect(screen.getByRole('main')).toHaveProperty('inert', true);
    expect(screen.getByRole('contentinfo')).toHaveProperty('inert', true);

    links.at(-1)?.focus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(links.at(-1)).toHaveFocus();
  });

  it('restores each prior inert value after dismissal', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SiteHeader />
        <main>Main</main>
        <footer>Footer</footer>
      </>,
    );
    const header = document.querySelector('header');
    const main = screen.getByRole('main');
    const footer = screen.getByRole('contentinfo');
    expect(header).not.toBeNull();
    if (!header) return;

    header.inert = true;
    footer.inert = true;

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(header).toHaveProperty('inert', true);
    expect(main).toHaveProperty('inert', true);
    expect(footer).toHaveProperty('inert', true);

    await user.click(screen.getByRole('button', { name: 'Close navigation' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(header).toHaveProperty('inert', true);
    expect(main).toHaveProperty('inert', false);
    expect(footer).toHaveProperty('inert', true);
  });

  it('restores focus after backdrop dismissal', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const toggle = screen.getByRole('button', { name: 'Open navigation' });

    await user.click(toggle);
    const dialog = screen.getByRole('dialog', { name: 'Site navigation' });
    await user.pointer({ target: dialog, keys: '[MouseLeft]' });

    await waitFor(() => expect(toggle).toHaveFocus());
  });

  it('restores focus after the dedicated close button is activated', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const toggle = screen.getByRole('button', { name: 'Open navigation' });

    await user.click(toggle);
    await user.click(screen.getByRole('button', { name: 'Close navigation' }));

    await waitFor(() => expect(toggle).toHaveFocus());
  });

  it('marks the company destination as current on company routes', () => {
    navigationState.pathname = '/companies/goodman-laboratories';
    render(<SiteHeader />);

    expect(
      screen.getByRole('link', { name: 'Our Companies' }),
    ).toHaveAttribute('aria-current', 'page');
  });
});
