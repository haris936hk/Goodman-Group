import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { companies } from '@/data/companies';

import CompaniesPage from './page';

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

  it('does not invent companies for unconfirmed sectors', () => {
    render(<CompaniesPage />);

    expect(screen.getByRole('heading', { name: 'Automotive' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Real Estate' })).toBeInTheDocument();
    expect(
      screen.getAllByText('Operating entities to be confirmed.'),
    ).toHaveLength(2);
  });
});

