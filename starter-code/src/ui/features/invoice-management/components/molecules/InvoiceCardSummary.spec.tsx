import { render, screen } from '@testing-library/react';
import InvoiceCardSummary from './InvoiceCardSummary';
import { InvoiceStatus } from '../../types/Invoice.type';

describe('InvoiceCardSummary', () => {
  const mockInvoice = {
    id: 'RT3080',
    description: 'Test Invoice',
    createdAt: '2023-01-01',
    paymentDue: '2023-01-31',
    clientName: 'Test Client',
    clientEmail: 'test@example.com',
    status: InvoiceStatus.PENDING,
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom'
    },
    clientAddress: {
      street: '84 Church Way',
      city: 'Bradford',
      postCode: 'BD1 9PB',
      country: 'United Kingdom'
    },
    items: [],
    total: 1800.90
  };

  it('renders invoice ID correctly', () => {
    render(<InvoiceCardSummary invoice={mockInvoice} />);
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('RT3080')).toBeInTheDocument();
  });

  it('renders invoice description', () => {
    render(<InvoiceCardSummary invoice={mockInvoice} />);
    expect(screen.getByText('Test Invoice')).toBeInTheDocument();
  });

  it('renders sender address details', () => {
    render(<InvoiceCardSummary invoice={mockInvoice} />);
    expect(screen.getByText('19 Union Terrace')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('E1 3EZ')).toBeInTheDocument();
    expect(screen.getAllByText('United Kingdom')[0]).toBeInTheDocument();
  });

  it('renders dates in correct format', () => {
    render(<InvoiceCardSummary invoice={mockInvoice} />);
    expect(screen.getByText('01 Jan 2023')).toBeInTheDocument(); // Created date
    expect(screen.getByText('31 Jan 2023')).toBeInTheDocument(); // Due date
  });

  it('renders client address details', () => {
    render(<InvoiceCardSummary invoice={mockInvoice} />);
    expect(screen.getByText('84 Church Way')).toBeInTheDocument();
    expect(screen.getByText('Bradford')).toBeInTheDocument();
    expect(screen.getByText('BD1 9PB')).toBeInTheDocument();
  });

  it('renders client email', () => {
    render(<InvoiceCardSummary invoice={mockInvoice} />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders all section labels', () => {
    render(<InvoiceCardSummary invoice={mockInvoice} />);
    expect(screen.getByText('Invoice Date')).toBeInTheDocument();
    expect(screen.getByText('Payment Due')).toBeInTheDocument();
    expect(screen.getByText('Bill To')).toBeInTheDocument();
    expect(screen.getByText('Sent to')).toBeInTheDocument();
  });
});
