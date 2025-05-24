import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useInvoiceForm } from './useInvoiceForm';
import { InvoiceFormService } from '../services/InvoiceForm.service';
import { InvoiceStatus } from '../types/Invoice.type';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('../../../shared/hooks/AllFeatureLayoutContext', () => ({
  useAllFeatureLayoutContext: () => ({
    setShowInvoiceForm: vi.fn(),
    setShouldInvoiceListingRefresh: vi.fn(),
    setMessageDialog: vi.fn()
  })
}));

vi.mock('../services/InvoiceForm.service', () => ({
  InvoiceFormService: {
    createInvoice: vi.fn(),
    updateInvoice: vi.fn()
  }
}));

describe('useInvoiceForm', () => {
  const mockInvoice = {
    id: '1',
    senderAddress: {
      street: 'Test Street',
      city: 'Test City',
      postCode: '12345',
      country: 'Test Country'
    },
    clientAddress: {
      street: 'Client Street',
      city: 'Client City',
      postCode: '54321',
      country: 'Client Country'
    },
    clientName: 'Test Client',
    clientEmail: 'test@example.com',
    createdAt: '2023-01-01',
    description: 'Test Description',
    status: InvoiceStatus.PENDING,
    items: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default empty form data when no invoice provided', () => {
    const { result } = renderHook(() => useInvoiceForm());
    
    expect(result.current.formData).toEqual({
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
      invoice: {
        clientName: '',
        clientEmail: '',
        createdAt: expect.any(String),
        paymentTerms: null,
        description: ''
      },
      invoiceItems: []
    });
  });

  it('initializes with provided invoice data', () => {
    const { result } = renderHook(() => useInvoiceForm(mockInvoice));

    expect(result.current.formData.senderAddress).toEqual(mockInvoice.senderAddress);
    expect(result.current.formData.clientAddress).toEqual(mockInvoice.clientAddress);
    expect(result.current.formData.invoice.clientName).toBe(mockInvoice.clientName);
    expect(result.current.formData.invoice.clientEmail).toBe(mockInvoice.clientEmail);
  });

  it('handles successful invoice creation', async () => {
    vi.mocked(InvoiceFormService.createInvoice).mockResolvedValue({
      data: mockInvoice,
      time_taken_in_ms: 100,
      status_code: 201,
      status: 'Invoice created successfully'
    });

    const { result } = renderHook(() => useInvoiceForm());

    await act(async () => {
      await result.current.handleCreateInvoice(InvoiceStatus.PENDING);
    });

    expect(InvoiceFormService.createInvoice).toHaveBeenCalledWith(
      result.current.formData,
      'pending'
    );
  });

  it('handles failed invoice creation', async () => {
    vi.mocked(InvoiceFormService.createInvoice).mockResolvedValue({
      data: null,
      time_taken_in_ms: 100,
      status_code: 400,
      status: 'Failed to create invoice'
    });

    const { result } = renderHook(() => useInvoiceForm());

    await act(async () => {
      await result.current.handleCreateInvoice(InvoiceStatus.PENDING);
    });

    expect(InvoiceFormService.createInvoice).toHaveBeenCalledWith(
      result.current.formData,
      'pending'
    );
  });

  it('handles successful invoice update', async () => {
    vi.mocked(InvoiceFormService.updateInvoice).mockResolvedValue({
      data: mockInvoice,
      time_taken_in_ms: 100,
      status_code: 200,
      status: 'Invoice updated successfully'
    });

    const { result } = renderHook(() => useInvoiceForm(mockInvoice));

    await act(async () => {
      await result.current.handleUpdateInvoice();
    });

    expect(InvoiceFormService.updateInvoice).toHaveBeenCalledWith(
      mockInvoice.id,
      result.current.formData
    );
  });

  it('handles failed invoice update', async () => {
    vi.mocked(InvoiceFormService.updateInvoice).mockResolvedValue({
      data: null,
      time_taken_in_ms: 100,
      status_code: 400,
      status: 'Failed to update invoice'
    });

    const { result } = renderHook(() => useInvoiceForm(mockInvoice));

    await act(async () => {
      await result.current.handleUpdateInvoice();
    });

    expect(InvoiceFormService.updateInvoice).toHaveBeenCalledWith(
      mockInvoice.id,
      result.current.formData
    );
  });

  it('updates form data when setFormData is called', () => {
    const { result } = renderHook(() => useInvoiceForm());

    act(() => {
      result.current.setFormData({
        ...result.current.formData,
        invoice: {
          ...result.current.formData.invoice,
          clientName: 'New Client Name'
        }
      });
    });

    expect(result.current.formData.invoice.clientName).toBe('New Client Name');
  });
});
