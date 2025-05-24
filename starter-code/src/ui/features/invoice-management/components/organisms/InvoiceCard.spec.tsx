import { render, screen } from '@testing-library/react';
import InvoiceCard from './InvoiceCard';
import { InvoiceStatus } from '../../types/Invoice.type';

describe('InvoiceCard', () => {
  const mockInvoice = {
    id: 'RT3080',
    createdAt: '2021-08-18',
    paymentDue: '2021-08-19',
    description: 'Re-branding',
    paymentTerms: 1,
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    status: InvoiceStatus.PAID,
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom'
    },
    clientAddress: {
      street: '106 Kendell Street',
      city: 'Sharrington',
      postCode: 'NR24 5WQ', 
      country: 'United Kingdom'
    },
    items: [
      {
        name: 'Brand Guidelines',
        quantity: 1,
        price: 1800.90,
        total: 1800.90,
        invoiceId: 'RT3080'
      }
    ],
    total: 1800.90
  };

  it('renders invoice card with summary section', () => {
    render(<InvoiceCard invoice={mockInvoice} />);
    expect(screen.getByText('RT3080')).toBeInTheDocument();
  });

  it('renders invoice items section with total', () => {
    render(<InvoiceCard invoice={mockInvoice} />);
    expect(screen.getByText('Brand Guidelines')).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    const { container } = render(<InvoiceCard invoice={mockInvoice} />);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-primary-light', 'dark:bg-surface-dark', 'rounded-lg', 'shadow-md');
  });
});
