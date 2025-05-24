import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import InvoiceListingTable from './InvoiceListingTable';
import { InvoiceStatus } from '../../types/Invoice.type';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

const mockInvoices = [
  {
    id: 'RT3080',
    paymentDue: '2021-08-19',
    clientName: 'Jensen Huang',
    total: 1800.90,
    status: InvoiceStatus.PAID,
    items: []
  },
  {
    id: 'XM9141', 
    paymentDue: '2021-09-20',
    clientName: 'Alex Grim',
    total: 556.00,
    status: InvoiceStatus.PENDING,
    items: []
  }
];

describe('InvoiceListingTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders invoice list correctly', () => {
    render(
      <InvoiceListingTable 
        invoices={mockInvoices}
        hasMore={false}
        loading={false}
        onLoadMore={() => {}}
      />
    );

    expect(screen.getByText('#RT3080')).toBeInTheDocument();
    expect(screen.getByText('Jensen Huang')).toBeInTheDocument();
    expect(screen.getByText('Due 19 Aug 2021')).toBeInTheDocument();
    expect(screen.getByText('£ 1,800.90')).toBeInTheDocument();

    expect(screen.getByText('#XM9141')).toBeInTheDocument();
    expect(screen.getByText('Alex Grim')).toBeInTheDocument();
    expect(screen.getByText('Due 20 Sep 2021')).toBeInTheDocument();
    expect(screen.getByText('£ 556.00')).toBeInTheDocument();
  });

  it('shows loading indicator when loading prop is true', () => {
    render(
      <InvoiceListingTable 
        invoices={[]}
        hasMore={false}
        loading={true}
        onLoadMore={() => {}}
      />
    );

    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('navigates to invoice detail when row is clicked', () => {
    render(
      <InvoiceListingTable 
        invoices={mockInvoices}
        hasMore={false}
        loading={false}
        onLoadMore={() => {}}
      />
    );

    const firstRow = screen.getByText('#RT3080').closest('tr');
    fireEvent.click(firstRow!);

    expect(mockNavigate).toHaveBeenCalledWith('/invoices/RT3080');
  });

  it('renders empty table when no invoices', () => {
    render(
      <InvoiceListingTable 
        invoices={[]}
        hasMore={false}
        loading={false}
        onLoadMore={() => {}}
      />
    );

    const tbody = screen.getByRole('rowgroup');
    expect(tbody.children.length).toBe(0);
  });
});
