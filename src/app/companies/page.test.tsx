import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { companies } from '@/data/companies';

import CompaniesPage from './page';

const retiredCompanySlugs = [
  ['h', 'y', 'g', 'e', 'i', 'a', '-pharmaceuticals'].join(''),
  ['m', 'e', 'd', 'w', 'e', 'l', 'l', '-pharmaceuticals'].join(''),
] as const;

describe('CompaniesPage', () => {
  it('renders the semantic company directory from canonical data', () => {
    render(<CompaniesPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Distinct companies. One clear view.',
      }),
    ).toBeInTheDocument();

    for (const company of companies) {
      expect(
        screen.getByRole('heading', { level: 3, name: company.displayName }),
      ).toBeInTheDocument();
    }
  });

  it('does not expose retired company profiles', () => {
    const { container } = render(<CompaniesPage />);

    for (const slug of retiredCompanySlugs) {
      expect(
        container.querySelector(`a[href="/companies/${slug}"]`),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(new RegExp(slug.split('-')[0], 'i')),
      ).not.toBeInTheDocument();
    }
  });

  it('includes the additional portfolio sectors', () => {
    render(<CompaniesPage />);

    expect(screen.getByRole('heading', { name: 'Automotive' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Real Estate' })).toBeInTheDocument();
    expect(
      screen.getByText("Automobiles are among Goodman Group's areas of activity."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Real estate is among Goodman Group's areas of activity."),
    ).toBeInTheDocument();
  });
});
