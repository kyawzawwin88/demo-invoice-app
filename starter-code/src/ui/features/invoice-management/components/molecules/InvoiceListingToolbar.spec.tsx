import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';
import InvoiceListingToolbar from './InvoiceListingToolbar';
import { useAllFeatureLayoutContext } from '../../../../shared/hooks/AllFeatureLayoutContext';

// Mock the context hook
vi.mock('../../../../shared/hooks/AllFeatureLayoutContext', () => ({
  useAllFeatureLayoutContext: vi.fn()
}));

describe('InvoiceListingToolbar', () => {
  const mockSetShowInvoiceForm = vi.fn();
  const mockOnSelectedMenuItemChange = vi.fn();

  const mockProps = {
    totalInvoices: 5,
    onSelectedMenuItemChange: mockOnSelectedMenuItemChange
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAllFeatureLayoutContext as jest.Mock).mockReturnValue({
      setShowInvoiceForm: mockSetShowInvoiceForm
    });
  });

  it('renders the total number of invoices', () => {
    render(<InvoiceListingToolbar {...mockProps} />);
    expect(screen.getByText('There are 5 total invoices')).toBeInTheDocument();
  });

  it('renders the filter dropdown with correct options', () => {
    render(<InvoiceListingToolbar {...mockProps} />);
    
    const filterSelect = screen.getByText('Filter by status');
    expect(filterSelect).toBeInTheDocument();
  });

  it('shows new invoice form when New Invoice button is clicked', () => {
    render(<InvoiceListingToolbar {...mockProps} />);
    
    const newInvoiceButton = screen.getByText('New Invoice');
    fireEvent.click(newInvoiceButton);
    
    expect(mockSetShowInvoiceForm).toHaveBeenCalledWith({ visible: true });
  });

  it('renders with default totalInvoices when not provided', () => {
    const { totalInvoices, ...propsWithoutTotal } = mockProps;
    render(<InvoiceListingToolbar {...propsWithoutTotal} />);
    
    expect(screen.getByText('There are 0 total invoices')).toBeInTheDocument();
  });
});
