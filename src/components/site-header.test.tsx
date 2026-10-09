import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SiteHeader } from './site-header';

const navigationState = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));


afterEach(() => {
  document.body.style.overflow = '';
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themeExplicit;
  Reflect.deleteProperty(window, 'matchMedia');
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

  it('opens and displays the mobile navigation dialog', async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeVisible();
  });

  it('toggles closed when clicking the menu toggle while open', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const toggle = screen.getByRole('button', { name: 'Open navigation' });

    await user.click(toggle);
    expect(screen.getByRole('dialog', { name: 'Site navigation' })).toBeInTheDocument();

    await user.click(toggle);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
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

describe('Group theme control', () => {
  it('toggles the Group shell and root theme and persists explicit choices', async () => {
    const user = userEvent.setup();
    localStorage.clear();
    document.documentElement.dataset.theme = 'dark';
    render(
      <div className="site-shell"><SiteHeader /></div>,
    );
    const shell = document.querySelector<HTMLElement>('.site-shell')!;
    const light = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(shell.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(light).toHaveAttribute('aria-pressed', 'false');
    expect(localStorage.getItem('goodman-group-theme')).toBeNull();

    await user.click(light);
    expect(shell.dataset.theme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('goodman-group-theme')).toBe('light');

    const dark = screen.getByRole('button', { name: 'Switch to dark mode' });
    dark.focus();
    await user.keyboard('{Enter}');
    expect(shell.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('goodman-group-theme')).toBe('dark');
  });

  it('defaults to light device preference when storage is absent and updates on root theme change', async () => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themeExplicit;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<div className="site-shell"><SiteHeader /></div>);
    const shell = document.querySelector<HTMLElement>('.site-shell')!;
    expect(shell.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('goodman-group-theme')).toBeNull();

    document.documentElement.dataset.theme = 'dark';
    await waitFor(() => {
      expect(shell.dataset.theme).toBe('dark');
      expect(screen.getByRole('button', { name: 'Switch to light mode' })).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('ignores malformed storage and remains operable when storage throws', async () => {
    const user = userEvent.setup();
    localStorage.setItem('goodman-group-theme', 'invalid');
    document.documentElement.dataset.theme = 'dark';
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    render(<div className="site-shell"><SiteHeader /></div>);
    const shell = document.querySelector<HTMLElement>('.site-shell')!;
    expect(shell.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    await user.click(screen.getByRole('button', { name: 'Switch to light mode' }));
    expect(shell.dataset.theme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.dataset.themeExplicit).toBe('true');
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute('aria-pressed', 'true');
  });
});
