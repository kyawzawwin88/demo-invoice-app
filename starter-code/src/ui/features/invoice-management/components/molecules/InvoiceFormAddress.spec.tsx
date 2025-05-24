import { render, screen, fireEvent } from '@testing-library/react';
import InvoiceFormAddress from './InvoiceFormAddress';
import { vi } from 'vitest';

describe('InvoiceFormAddress', () => {
  const mockProps = {
    streetAddress: '123 Test St',
    city: 'Test City',
    postCode: 'TE1 2ST',
    country: 'Test Country',
    onStreetAddressChange: vi.fn(),
    onCityChange: vi.fn(),
    onPostCodeChange: vi.fn(),
    onCountryChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all address input fields with correct labels', () => {
    render(<InvoiceFormAddress {...mockProps} />);

    expect(screen.getByText('Street Address')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Post Code')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('displays the provided values in input fields', () => {
    render(<InvoiceFormAddress {...mockProps} />);

    expect(screen.getByDisplayValue('123 Test St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TE1 2ST')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Country')).toBeInTheDocument();
  });

  it('calls appropriate handlers when input values change', () => {
    render(<InvoiceFormAddress {...mockProps} />);

    const streetInput = screen.getByDisplayValue('123 Test St');
    const cityInput = screen.getByDisplayValue('Test City');
    const postCodeInput = screen.getByDisplayValue('TE1 2ST');
    const countryInput = screen.getByDisplayValue('Test Country');

    fireEvent.change(streetInput, { target: { value: 'New Street' } });
    expect(mockProps.onStreetAddressChange).toHaveBeenCalledWith('New Street');

    fireEvent.change(cityInput, { target: { value: 'New City' } });
    expect(mockProps.onCityChange).toHaveBeenCalledWith('New City');

    fireEvent.change(postCodeInput, { target: { value: 'NE1 2WC' } });
    expect(mockProps.onPostCodeChange).toHaveBeenCalledWith('NE1 2WC');

    fireEvent.change(countryInput, { target: { value: 'New Country' } });
    expect(mockProps.onCountryChange).toHaveBeenCalledWith('New Country');
  });
});
