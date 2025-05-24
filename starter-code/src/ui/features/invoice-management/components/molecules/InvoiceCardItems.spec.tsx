import { render, screen } from '@testing-library/react';
import InvoiceCardItems from './InvoiceCardItems';

describe('InvoiceCardItems', () => {
  const mockItems = [
    {
      id: '1',
      name: 'Test Item 1',
      quantity: 2,
      price: 100,
      invoiceId: '1'
    },
    {
      id: '2', 
      name: 'Test Item 2',
      quantity: 1,
      price: 50,
      invoiceId: '1'
    }
  ];

  const mockTotal = 250;

  it('renders table headers correctly', () => {
    render(<InvoiceCardItems items={mockItems} total={mockTotal} />);
    
    expect(screen.getByText('Item Name')).toBeInTheDocument();
    expect(screen.getByText('QTY.')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('renders item details correctly', () => {
    render(<InvoiceCardItems items={mockItems} total={mockTotal} />);

    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('£ 100')).toBeInTheDocument();
    expect(screen.getByText('£200.00')).toBeInTheDocument();

    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('£ 50')).toBeInTheDocument();
    expect(screen.getByText('£50.00')).toBeInTheDocument();
  });

  it('renders total amount correctly', () => {
    render(<InvoiceCardItems items={mockItems} total={mockTotal} />);
    
    expect(screen.getByText('Amount Due')).toBeInTheDocument();
    expect(screen.getByText('£ 250')).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    render(<InvoiceCardItems items={[]} total={0} />);
    
    expect(screen.getByText('Amount Due')).toBeInTheDocument();
    expect(screen.getByText('£ 0')).toBeInTheDocument();
  });
});
