import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';

import Home from './page';

describe('Home', () => {
  it('renders the primary page heading', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('provides a semantic main landmark', () => {
    const { container } = render(<Home />);

    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('focuses the hero on the centered Goodman Group visual system', () => {
    const { container } = render(<Home />);
    const hero = container.querySelector('[data-hero]');

    expect(hero).toBeInTheDocument();
    expect(hero?.querySelector('.hero-copy')).not.toBeInTheDocument();
    expect(hero?.querySelector('.hero-scroll-cue')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Goodman Group' }),
    ).toHaveClass('sr-only');
    expect(hero).not.toHaveTextContent('Health · Wellness · Progress');
    expect(hero).not.toHaveTextContent('Distinct strengths.');
    expect(hero).not.toHaveTextContent('Shared momentum.');
    expect(hero).not.toHaveTextContent('Scroll to explore');
  });

  it('preserves the complete hero visual system', () => {
    const { container } = render(<Home />);
    const hero = container.querySelector('[data-hero]');

    expect(hero?.querySelector('.hero-glow')).toBeInTheDocument();
    expect(hero?.querySelectorAll('[data-orbit-ring]')).toHaveLength(2);
    expect(hero?.querySelectorAll('.orbit-node')).toHaveLength(3);
    expect(hero?.querySelectorAll('.orbit-pip')).toHaveLength(3);
    expect(hero?.querySelector('.group-core')).toBeInTheDocument();
    expect(hero?.querySelector('.system-caption')).toBeInTheDocument();
    expect(screen.getByText('One clear structure')).toBeInTheDocument();
    expect(screen.getByText('Many distinct company identities')).toBeInTheDocument();
  });

  it('exposes every company through direct discoverability without sector grouping', () => {
    render(<Home />);

    expect(
      screen.queryByRole('heading', { name: 'Different sectors. No false sameness.' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Four operating companies. No false sameness.' }),
    ).toBeInTheDocument();

    for (const company of [
      { name: 'Goodman Laboratories', slug: 'goodman-laboratories' },
      { name: 'Geron Pharma', slug: 'geron-pharma' },
      { name: 'Goodman Medical Equipment Trading', slug: 'goodman-medical-equipment' },
      { name: 'Wal Green Chemicals', slug: 'wal-green-chemicals' },
    ]) {
      const links = screen.getAllByRole('link', { name: `View ${company.name}` });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute('href', `/companies/${company.slug}`);
    }
  });

  it('opens and closes the accessible mobile navigation', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const openButton = screen.getByRole('button', {
      name: 'Open navigation',
    });

    await user.click(openButton);

    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Navigation menu (open)' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Close navigation' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('navigation', { name: 'Mobile navigation' }),
      ).not.toBeInTheDocument();
    });
  });
});
