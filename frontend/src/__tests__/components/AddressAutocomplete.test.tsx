import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressAutocomplete } from '../../components/AddressAutocomplete';

// Mock the address search hook
vi.mock('../../hooks/useAddressSearch', () => ({
  useAddressSearch: vi.fn(),
}));

// Mock the click outside hook
vi.mock('../../hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

import { useAddressSearch } from '../../hooks/useAddressSearch';
import { useClickOutside } from '../../hooks/useClickOutside';

const mockUseAddressSearch = useAddressSearch as ReturnType<typeof vi.fn>;
const mockUseClickOutside = useClickOutside as ReturnType<typeof vi.fn>;

describe('AddressAutocomplete', () => {
  const mockSearch = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseClickOutside.mockImplementation(() => {});
    mockUseAddressSearch.mockReturnValue({
      results: [],
      loading: false,
      error: null,
      search: mockSearch,
      clearError: mockClearError,
    });
  });

  it('should render input field', () => {
    render(<AddressAutocomplete />);
    expect(screen.getByPlaceholderText(/search for an address/i)).toBeInTheDocument();
  });

  it('should call search when user types', async () => {
    const user = userEvent.setup({ delay: null });
    render(<AddressAutocomplete />);

    const input = screen.getByPlaceholderText(/search for an address/i);
    await user.type(input, 'test');

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('test');
    });
  });

  it('should display loading indicator when loading', () => {
    mockUseAddressSearch.mockReturnValue({
      results: [],
      loading: true,
      error: null,
      search: mockSearch,
      clearError: mockClearError,
    });

    render(<AddressAutocomplete />);
    expect(screen.getByLabelText(/loading results/i)).toBeInTheDocument();
  });

  it('should display error message when error occurs', () => {
    mockUseAddressSearch.mockReturnValue({
      results: [],
      loading: false,
      error: 'Network error',
      search: mockSearch,
      clearError: mockClearError,
    });

    render(<AddressAutocomplete />);
    expect(screen.getByRole('alert')).toHaveTextContent('Network error');
  });

  it('should display results when available', () => {
    const mockResults = [
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

    mockUseAddressSearch.mockReturnValue({
      results: mockResults,
      loading: false,
      error: null,
      search: mockSearch,
      clearError: mockClearError,
    });

    const user = userEvent.setup({ delay: null });
    render(<AddressAutocomplete />);

    const input = screen.getByPlaceholderText(/search for an address/i);
    user.type(input, 'test');

    waitFor(() => {
      expect(screen.getByText('Test Street')).toBeInTheDocument();
      expect(screen.getByText('501 OSLO')).toBeInTheDocument();
    });
  });

  it('should call onSelect when address is selected', async () => {
    const mockOnSelect = vi.fn();
    const mockResults = [
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

    mockUseAddressSearch.mockReturnValue({
      results: mockResults,
      loading: false,
      error: null,
      search: mockSearch,
      clearError: mockClearError,
    });

    const user = userEvent.setup({ delay: null });
    render(<AddressAutocomplete onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText(/search for an address/i);
    await user.type(input, 'test');

    await waitFor(() => {
      const resultItem = screen.getByText('Test Street');
      user.click(resultItem);
    });

    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith(mockResults[0]);
    });
  });

  it('should show clear button when input has value', async () => {
    render(<AddressAutocomplete />);

    const input = screen.getByPlaceholderText(/search for an address/i);
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
    });
  });
});

