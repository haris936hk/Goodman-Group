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

  it('exposes every company through a normal profile link', () => {
    render(<Home />);

    expect(
      screen.getByRole('link', { name: 'View Goodman Laboratories' }),
    ).toHaveAttribute('href', '/companies/goodman-laboratories');
    expect(
      screen.getByRole('link', { name: 'View Wal Green Chemicals' }),
    ).toHaveAttribute('href', '/companies/wal-green-chemicals');
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
