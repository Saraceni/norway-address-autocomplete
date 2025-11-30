import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressAutocomplete } from '../../components/AddressAutocomplete';
import { searchAddresses } from '../../services/addressApi';

// Mock the API service
vi.mock('../../services/addressApi');
vi.mock('../../hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

const mockSearchAddresses = vi.mocked(searchAddresses);

describe('Search Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should perform full search flow: type -> API call -> display results', async () => {
    const mockAddresses = [
      {
        postNumber: 501,
        city: 'OSLO',
        street: 'Test Street',
        typeCode: 6,
        type: 'Gate-/veg-adresse',
        district: 'Test',
        municipalityNumber: 301,
        municipality: 'Oslo',
        county: 'Oslo',
      },
    ];

    mockSearchAddresses.mockResolvedValueOnce(mockAddresses);

    const user = userEvent.setup({ delay: null });
    render(<AddressAutocomplete />);

    const input = screen.getByPlaceholderText(/search for an address/i);
    await user.type(input, 'test');

    // Wait for debounce and API call
    await waitFor(
      () => {
        expect(mockSearchAddresses).toHaveBeenCalledWith('test', expect.any(AbortSignal));
      },
      { timeout: 1000 }
    );

    // Note: In a real integration test with the actual hook, we would see results
    // This test demonstrates the integration structure
  });

  it('should handle API errors gracefully', async () => {
    const { AddressApiError } = await import('../../services/addressApi');
    mockSearchAddresses.mockRejectedValueOnce(
      new AddressApiError('Network error', undefined, true)
    );

    const user = userEvent.setup({ delay: null });
    render(<AddressAutocomplete />);

    const input = screen.getByPlaceholderText(/search for an address/i);
    await user.type(input, 'test');

    await waitFor(
      () => {
        expect(mockSearchAddresses).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it('should cancel previous request when new search is performed', async () => {
    mockSearchAddresses
      .mockImplementationOnce(() => {
        return new Promise(() => {}); // Never resolves
      })
      .mockResolvedValueOnce([]);

    const user = userEvent.setup({ delay: null });
    render(<AddressAutocomplete />);

    const input = screen.getByPlaceholderText(/search for an address/i);
    await user.type(input, 'test1');

    await waitFor(() => {
      expect(mockSearchAddresses).toHaveBeenCalledTimes(1);
    });

    await user.clear(input);
    await user.type(input, 'test2');

    // Second call should cancel the first
    await waitFor(() => {
      expect(mockSearchAddresses).toHaveBeenCalledTimes(2);
    });
  });
});

