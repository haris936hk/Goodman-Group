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

  it('renders a company profile', async () => {
    const page = await CompanyPage({
      params: Promise.resolve({ slug: 'goodman-laboratories' }),
    });

    render(page);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Goodman Laboratories' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Legal identity')).toBeInTheDocument();
    expect(screen.getByText('Goodman Laboratories (Pvt.) Ltd.')).toBeInTheDocument();
  });

  it('generates public metadata and handles unknown records', async () => {
    const companyMetadata = await generateMetadata({
      params: Promise.resolve({ slug: 'wal-green-chemicals' }),
    });
    expect(companyMetadata).toMatchObject({
      title: 'Wal Green Chemicals',
      description: 'A chemicals business. Syed Talib Hussain Hashmi is its CEO since 2021.',
    });

    await expect(
      generateMetadata({ params: Promise.resolve({ slug: 'unknown' }) }),
    ).resolves.toEqual({
      title: 'Company not found',
      robots: { index: false, follow: false },
    });
    expect(getCompanyBySlug('unknown')).toBeUndefined();
  });
});
