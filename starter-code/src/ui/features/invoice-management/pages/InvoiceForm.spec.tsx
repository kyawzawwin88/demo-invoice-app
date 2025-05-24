import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import InvoiceForm from './InvoiceForm';
import { useAllFeatureLayoutContext } from '../../../shared/hooks/AllFeatureLayoutContext';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { InvoiceStatus, PaymentTerms } from '../types/Invoice.type';

// Mock dependencies
vi.mock('../../../shared/hooks/AllFeatureLayoutContext', () => ({
  useAllFeatureLayoutContext: vi.fn()
}));

vi.mock('../hooks/useInvoiceForm', () => ({
  useInvoiceForm: vi.fn()
}));

describe('InvoiceForm', () => {
  const mockSetShowInvoiceForm = vi.fn();
  const mockSetFormData = vi.fn();
  const mockHandleCreateInvoice = vi.fn();
  const mockHandleUpdateInvoice = vi.fn();

  const mockFormData = {
    invoice: {
      clientName: '',
      clientEmail: '',
      createdAt: '',
      paymentTerms: '',
      description: '',
    },
    senderAddress: {
      street: '',
      city: '',
      postCode: '',
      country: ''
    },
    clientAddress: {
      street: '',
      city: '',
      postCode: '',
      country: ''
    },
    invoiceItems: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAllFeatureLayoutContext as jest.Mock).mockReturnValue({
      setShowInvoiceForm: mockSetShowInvoiceForm
    });

    (useInvoiceForm as jest.Mock).mockReturnValue({
      formData: mockFormData,
      setFormData: mockSetFormData,
      handleCreateInvoice: mockHandleCreateInvoice,
      handleUpdateInvoice: mockHandleUpdateInvoice
    });
  });

  it('should render new invoice form when no invoice provided', () => {
    render(<InvoiceForm />);
    expect(screen.getByText('New Invoice')).toBeInTheDocument();
  });

  it('should render edit invoice form when invoice provided', () => {
    render(<InvoiceForm invoice={{ id: 'TEST123' }} />);
    expect(screen.getByText('Edit #TEST123')).toBeInTheDocument();
  });

  it('should update form data when client name changes', () => {
    render(<InvoiceForm />);

    const input = screen.getByTestId('clientName');    
    fireEvent.change(input, { target: { value: 'Test Client' } });
    
    expect(mockSetFormData).toHaveBeenCalled();
  });

  it('should call handleCreateInvoice with DRAFT status when saving as draft', () => {
    render(<InvoiceForm />);
    const saveAsDraftButton = screen.getByText('Save as Draft');
    fireEvent.click(saveAsDraftButton);
    
    expect(mockHandleCreateInvoice).toHaveBeenCalledWith(InvoiceStatus.DRAFT);
  });

  it('should call handleCreateInvoice with PENDING status when saving and sending', () => {
    render(<InvoiceForm />);
    const saveAndSendButton = screen.getByText('Save & Send');
    fireEvent.click(saveAndSendButton);
    
    expect(mockHandleCreateInvoice).toHaveBeenCalledWith(InvoiceStatus.PENDING);
  });

  it('should call handleUpdateInvoice when updating existing invoice', () => {
    render(<InvoiceForm invoice={{ id: 'TEST123' }} />);
    const saveChangesButton = screen.getByText('Update');
    fireEvent.click(saveChangesButton);
    
    expect(mockHandleUpdateInvoice).toHaveBeenCalled();
  });

  it('should close form when discarding', () => {
    render(<InvoiceForm />);
    const discardButton = screen.getByText('Discard');
    fireEvent.click(discardButton);
    
    expect(mockSetShowInvoiceForm).toHaveBeenCalledWith({ visible: false });
  });
});
