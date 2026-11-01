import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { companies } from '@/data/companies';
import { goodmanGroup } from '@/data/goodman-group';
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

  it('omits the Measure chapter and its navigation link', () => {
    const { container } = render(<Home />);

    expect(container.querySelector('.proof-chapter')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Responsibility' }),
    ).not.toBeInTheDocument();
  });
  it('omits the portfolio intro tile from the Reveal chapter', () => {
    render(<Home />);

    expect(screen.getByText('01 / Reveal')).toBeInTheDocument();
    expect(
      screen.queryByText('A parent brand connecting distinct company identities'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'View complete company index' }),
    ).not.toBeInTheDocument();
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

  it('preserves the hero constellation without a redundant Group label', () => {
    const { container } = render(<Home />);
    const hero = container.querySelector('[data-hero]');
    const groupCore = hero?.querySelector('.group-core');

    expect(hero?.querySelector('.hero-glow')).toBeInTheDocument();
    expect(hero?.querySelectorAll('[data-orbit-ring]')).toHaveLength(2);
    expect(hero?.querySelectorAll('.orbit-pip')).toHaveLength(3);
    expect(groupCore).toBeInTheDocument();
    expect(groupCore).not.toHaveTextContent('Parent Group');
  });

  it('links every canonical company exactly once from the hero orbit', () => {
    const { container } = render(<Home />);
    const hero = container.querySelector('[data-hero]');

    expect(hero).toBeInTheDocument();
    for (const company of companies) {
      const links = within(hero as HTMLElement).getAllByRole('link', {
        name: company.displayName,
      });
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute('href', `/companies/${company.slug}`);
    }
  });

  it('focuses Reveal on Group mission, title, message, and direct company discovery without sector lists', () => {
    const { container } = render(<Home />);
    const portfolio = container.querySelector('#portfolio');
    expect(portfolio).toBeInTheDocument();

    const scoped = within(portfolio as HTMLElement);
    expect(scoped.getByText(goodmanGroup.websiteTitle)).toBeInTheDocument();
    expect(scoped.getByText(goodmanGroup.message)).toBeInTheDocument();
    expect(scoped.getByText(goodmanGroup.mission)).toBeInTheDocument();

    expect(
      scoped.queryByRole('list', { name: 'Goodman Group operating sectors' }),
    ).not.toBeInTheDocument();
    expect(
      scoped.queryByRole('list', { name: 'Goodman Group business interests' }),
    ).not.toBeInTheDocument();

    for (const company of companies) {
      const companyLink = scoped.getByRole('link', { name: `View ${company.displayName}` });
      expect(companyLink).toHaveAttribute('href', `/companies/${company.slug}`);
    }
  });

  it('renders Goodman Group operating sectors in canonical order without links in Explore', () => {
    const { container } = render(<Home />);
    const groupStory = container.querySelector('#group-story');
    expect(groupStory).toBeInTheDocument();

    const scoped = within(groupStory as HTMLElement);
    const sectorList = scoped.getByRole('list', { name: 'Goodman Group operating sectors' });
    const items = within(sectorList).getAllByRole('listitem');

    expect(items).toHaveLength(goodmanGroup.sectors.length);
    items.forEach((item, index) => {
      expect(
        within(item).getByRole('heading', { level: 3, name: goodmanGroup.sectors[index] }),
      ).toBeInTheDocument();
    });

    expect(scoped.queryAllByRole('link')).toHaveLength(0);
  });

  it('omits the supplied copy while preserving its section headings', () => {
    render(<Home />);

    expect(
      screen.queryAllByText(/Core operating sectors across the Group/),
    ).toHaveLength(0);
    expect(
      screen.queryByText(
        'Serving government hospitals, private hospitals, retailers and national distributors.',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Active operations, partner distribution, supply agreements, sourcing channels, and planned expansion across operating companies.',
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Operating Sectors' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Our clients' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Our presence across regional and global markets.',
      }),
    ).toBeInTheDocument();
  });

  it('labels Ghana as a five-year agreement signed in 2024 in the Expand market ledger', () => {
    render(<Home />);

    const markets = screen.getByRole('list', {
      name: 'Goodman Laboratories international markets',
    });
    expect(within(markets).getByText('Ghana')).toBeInTheDocument();
    expect(within(markets).getByText('Five-year agreement signed (2024)')).toBeInTheDocument();
  });

  it('removes the Advance and Connect sections and their stale links', () => {
    const { container } = render(<Home />);

    expect(container.querySelector('#news, #connect')).not.toBeInTheDocument();
    expect(
      container.querySelector('a[href="/#news"], a[href="/#connect"]'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: goodmanGroup.contacts.email }).getAttribute('href'),
    ).toContain(`mailto:${goodmanGroup.contacts.email}`);
  });

  it('renders executive contact details near Group leadership', () => {
    render(<Home />);

    expect(screen.getByRole('link', { name: '+92 336 777 0770' })).toHaveAttribute(
      'href',
      'tel:+923367770770',
    );
    expect(screen.getByRole('link', { name: '+92 311 154 8859' })).toHaveAttribute(
      'href',
      'tel:+923111548859',
    );
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
