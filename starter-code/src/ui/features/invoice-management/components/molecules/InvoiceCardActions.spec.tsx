import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InvoiceCardActions from './InvoiceCardActions';
import { AllFeatureLayoutContext } from '../../../../shared/hooks/AllFeatureLayoutContext';
import { InvoiceStatus } from '../../types/Invoice.type';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockSetShowInvoiceForm = vi.fn();
const mockSetMessageDialog = vi.fn();

const mockContextValue = {
  setShowInvoiceForm: mockSetShowInvoiceForm,
  setMessageDialog: mockSetMessageDialog,
  theme: 'light',
  setTheme: vi.fn(),
  shouldInvoiceListingRefresh: false,
  setShouldInvoiceListingRefresh: vi.fn(),
  showInvoiceForm: { visible: false },
  messageDialog: { visible: false, title: '', message: '', onClose: () => {} }
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <AllFeatureLayoutContext.Provider value={mockContextValue}>
      {ui}
    </AllFeatureLayoutContext.Provider>
  );
};

describe('InvoiceCardActions', () => {
  const mockInvoice = {
    id: '1',
    status: InvoiceStatus.PENDING,
    clientName: 'Test Client',
    total: 100,
    paymentDue: '2023-01-01',
    items: []
  };

  vi.mock('../../hooks/useInvoiceDetail', (mockInvoice) => ({
    useInvoiceDetail: () => ({
      invoice: mockInvoice
    })
  }));  

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders status badge', () => {
    renderWithRouter(<InvoiceCardActions invoice={mockInvoice} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('shows edit button for pending invoice', () => {
    renderWithRouter(<InvoiceCardActions invoice={mockInvoice} />);
    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);
    expect(mockSetShowInvoiceForm).toHaveBeenCalledWith({
      visible: true,
      invoice: mockInvoice
    });
  });

  it('shows delete button for pending invoice', () => {
    renderWithRouter(<InvoiceCardActions invoice={mockInvoice} />);
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();
  });

  it('shows mark as paid button for pending invoice', () => {
    renderWithRouter(<InvoiceCardActions invoice={mockInvoice} />);
    const markAsPaidButton = screen.getByText('Mark as Paid');
    expect(markAsPaidButton).toBeInTheDocument();
  });

  it('does not show action buttons for paid invoice', () => {
    const paidInvoice = { ...mockInvoice, status: InvoiceStatus.PAID };
    renderWithRouter(<InvoiceCardActions invoice={paidInvoice} />);
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.queryByText('Mark as Paid')).not.toBeInTheDocument();
  });

  it('opens delete confirmation dialog when delete button is clicked', () => {
    renderWithRouter(<InvoiceCardActions invoice={mockInvoice} />);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText(/Are you sure you want to delete invoice/)).toBeInTheDocument();
  });

  it('opens mark as paid confirmation dialog when mark as paid button is clicked', () => {
    renderWithRouter(<InvoiceCardActions invoice={mockInvoice} />);
    
    fireEvent.click(screen.getByText('Mark as Paid'));
    expect(screen.getByText(/Are you sure you want to mark this invoice as paid?/)).toBeInTheDocument();
  });
});
