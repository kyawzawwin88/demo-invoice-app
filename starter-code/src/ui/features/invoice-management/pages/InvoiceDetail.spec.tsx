import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceDetail from './InvoiceDetail';
import { useAllFeatureLayoutContext } from '../../../shared/hooks/AllFeatureLayoutContext';
import { useInvoiceDetail } from '../hooks/useInvoiceDetail';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn()
}));

vi.mock('../../../shared/hooks/AllFeatureLayoutContext', () => ({
  useAllFeatureLayoutContext: vi.fn()
}));

vi.mock('../hooks/useInvoiceDetail', () => ({
  useInvoiceDetail: vi.fn()
}));

describe('InvoiceDetail', () => {
  const mockNavigate = vi.fn();
  const mockSetMessageDialog = vi.fn();
  const mockSetShowAuditLog = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ id: 'TEST123' });
    (useAllFeatureLayoutContext as jest.Mock).mockReturnValue({
      setMessageDialog: mockSetMessageDialog
    });
  });

  it('should show loading indicator when loading', () => {
    (useInvoiceDetail as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      invoice: null,
      showAuditLog: false,
      setShowAuditLog: mockSetShowAuditLog
    });

    render(<InvoiceDetail />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('should show error dialog when there is an error', () => {
    const error = 'Test error';
    (useInvoiceDetail as jest.Mock).mockReturnValue({
      loading: false,
      error,
      invoice: null,
      showAuditLog: false,
      setShowAuditLog: mockSetShowAuditLog
    });

    render(<InvoiceDetail />);
    
    expect(mockSetMessageDialog).toHaveBeenCalledWith({
      visible: true,
      title: 'Error',
      message: error
    });
  });

  it('should render invoice details when data is loaded', () => {
    const mockInvoice = {
      id: 'TEST123',
      status: 'pending'
    };

    (useInvoiceDetail as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      invoice: mockInvoice,
      showAuditLog: false,
      setShowAuditLog: mockSetShowAuditLog
    });

    render(<InvoiceDetail />);

    expect(screen.getByText('Go back')).toBeInTheDocument();
    expect(screen.getByTestId('go-back')).toBeInTheDocument();
  });

  it('should navigate back when clicking go back button', () => {
    (useInvoiceDetail as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      invoice: { id: 'TEST123' },
      showAuditLog: false,
      setShowAuditLog: mockSetShowAuditLog
    });

    render(<InvoiceDetail />);
    
    const backButton = screen.getByTestId('go-back');
    backButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
