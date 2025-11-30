import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressList } from '../../components/AddressList';
import type { Address } from '../../types/address';

describe('AddressList', () => {
  const mockAddresses: Address[] = [
    {
      postNumber: 501,
      city: 'OSLO',
      street: 'Test Street 1',
      typeCode: 6,
      type: 'Gate-/veg-adresse',
      district: 'Test',
      municipalityNumber: 301,
      municipality: 'Oslo',
      county: 'Oslo',
    },
    {
      postNumber: 502,
      city: 'BERGEN',
      street: 'Test Street 2',
      typeCode: 6,
      type: 'Gate-/veg-adresse',
      district: 'Test',
      municipalityNumber: 1201,
      municipality: 'Bergen',
      county: 'Vestland',
    },
  ];

  it('should not render when addresses array is empty', () => {
    const { container } = render(
      <AddressList addresses={[]} onSelect={vi.fn()} highlightedIndex={-1} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render list of addresses', () => {
    render(
      <AddressList
        addresses={mockAddresses}
        onSelect={vi.fn()}
        highlightedIndex={-1}
      />
    );

    expect(screen.getByText('Test Street 1')).toBeInTheDocument();
    expect(screen.getByText('501 OSLO')).toBeInTheDocument();
    expect(screen.getByText('Test Street 2')).toBeInTheDocument();
    expect(screen.getByText('502 BERGEN')).toBeInTheDocument();
  });

  it('should call onSelect when address is clicked', async () => {
    const mockOnSelect = vi.fn();
    const user = userEvent.setup({ delay: null });

    render(
      <AddressList
        addresses={mockAddresses}
        onSelect={mockOnSelect}
        highlightedIndex={-1}
      />
    );

    const firstItem = screen.getByText('Test Street 1');
    await user.click(firstItem);

    expect(mockOnSelect).toHaveBeenCalledWith(mockAddresses[0]);
  });

  it('should highlight the item at highlightedIndex', () => {
    render(
      <AddressList
        addresses={mockAddresses}
        onSelect={vi.fn()}
        highlightedIndex={1}
      />
    );

    const items = screen.getAllByRole('option');
    expect(items[0]).not.toHaveClass('address-list-item--highlighted');
    expect(items[1]).toHaveClass('address-list-item--highlighted');
  });

  it('should set aria-selected correctly', () => {
    render(
      <AddressList
        addresses={mockAddresses}
        onSelect={vi.fn()}
        highlightedIndex={0}
      />
    );

    const items = screen.getAllByRole('option');
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
  });
});

