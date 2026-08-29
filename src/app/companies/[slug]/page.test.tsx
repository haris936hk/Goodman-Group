import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { companies, getCompanyBySlug } from '@/data/companies';

import CompanyPage, { generateMetadata, generateStaticParams } from './page';

describe('CompanyPage', () => {
  it('generates a static route for every canonical company', () => {
    expect(generateStaticParams()).toEqual(
      companies.map((company) => ({ slug: company.slug })),
    );
  });

  it('renders a truthful provisional profile', async () => {
    const page = await CompanyPage({
      params: Promise.resolve({ slug: 'goodman-laboratories' }),
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Goodman Laboratories' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Preview record — not publication-ready'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Pending verification').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Content awaiting approval')).toHaveLength(2);
  });

  it('marks provisional profiles noindex and handles unknown records', async () => {
    const provisionalMetadata = await generateMetadata({
      params: Promise.resolve({ slug: 'wal-green-chemicals' }),
    });
    expect(provisionalMetadata).toMatchObject({
      title: 'Wal Green Chemicals',
      robots: { index: false, follow: true },
    });
    expect(provisionalMetadata.alternates).toBeUndefined();

    await expect(
      generateMetadata({ params: Promise.resolve({ slug: 'unknown' }) }),
    ).resolves.toEqual({
      title: 'Company not found',
      robots: { index: false, follow: false },
    });
    expect(getCompanyBySlug('unknown')).toBeUndefined();
  });
});
