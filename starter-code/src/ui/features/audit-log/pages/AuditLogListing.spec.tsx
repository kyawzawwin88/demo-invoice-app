import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuditLogListing } from './AuditLogListing';
import { useAuditLogListing } from '../hooks/useAuditLogListing';
import { vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('../hooks/useAuditLogListing');

describe('AuditLogListing', () => {
  const mockInvoiceId = 'invoice-123';
  const mockLogs = [
    {
      id: '1',
      actionAt: '2023-01-01T00:00:00Z',
      message: 'Invoice created',
      actionType: 'created_draft'
    },
    {
      id: '2', 
      actionAt: '2023-01-02T00:00:00Z',
      message: 'Invoice updated',
      actionType: 'updated'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    (useAuditLogListing as Mock).mockReturnValue({
      logs: [],
      loading: true,
      error: null,
      hasMore: false,
      handleLoadMore: vi.fn()
    });

    render(<AuditLogListing invoiceId={mockInvoiceId} />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('should render error state', () => {
    (useAuditLogListing as Mock).mockReturnValue({
      logs: [],
      loading: false,
      error: 'Failed to load audit logs',
      hasMore: false,
      handleLoadMore: vi.fn()
    });

    render(<AuditLogListing invoiceId={mockInvoiceId} />);
    expect(screen.getByText('Error loading audit logs')).toBeInTheDocument();
  });

  it('should render audit logs', () => {
    (useAuditLogListing as Mock).mockReturnValue({
      logs: mockLogs,
      loading: false,
      error: null,
      hasMore: false,
      handleLoadMore: vi.fn()
    });

    render(<AuditLogListing invoiceId={mockInvoiceId} />);

    expect(screen.getByText('Invoice created')).toBeInTheDocument();
    expect(screen.getByText('Invoice updated')).toBeInTheDocument();
  });

  it('should render load more button and handle click', () => {
    const handleLoadMore = vi.fn();
    (useAuditLogListing as Mock).mockReturnValue({
      logs: mockLogs,
      loading: false,
      error: null,
      hasMore: true,
      handleLoadMore
    });

    render(<AuditLogListing invoiceId={mockInvoiceId} />);

    const loadMoreButton = screen.getByText('Load More');
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);
    expect(handleLoadMore).toHaveBeenCalled();
  });

  it('should not render load more button when hasMore is false', () => {
    (useAuditLogListing as Mock).mockReturnValue({
      logs: mockLogs,
      loading: false,
      error: null,
      hasMore: false,
      handleLoadMore: vi.fn()
    });

    render(<AuditLogListing invoiceId={mockInvoiceId} />);
    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });
});
