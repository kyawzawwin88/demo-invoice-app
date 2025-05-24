import { render, screen, fireEvent } from '@testing-library/react';
import InvoiceFormItem from './InvoiceFormItem';
import { vi } from 'vitest';

describe('InvoiceFormItem', () => {
  const mockProps = {
    itemIndex: 0,
    itemName: 'Test Item',
    quantity: 2,
    price: 10.99,
    onItemNameChange: vi.fn(),
    onQuantityChange: vi.fn(),
    onPriceChange: vi.fn(),
    onDelete: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all input fields with correct values', () => {
    render(<InvoiceFormItem {...mockProps} />);

    expect(screen.getByDisplayValue('Test Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10.99')).toBeInTheDocument();
  });

  it('displays the correct total amount', () => {
    render(<InvoiceFormItem {...mockProps} />);
    
    // Total should be quantity * price = 2 * 10.99 = 21.98
    expect(screen.getByText('£ 21.98')).toBeInTheDocument();
  });

  it('calls appropriate handlers when input values change', () => {
    render(<InvoiceFormItem {...mockProps} />);

    const nameInput = screen.getByDisplayValue('Test Item');
    const quantityInput = screen.getByDisplayValue('2');
    const priceInput = screen.getByDisplayValue('10.99');

    fireEvent.change(nameInput, { target: { value: 'New Item' } });
    expect(mockProps.onItemNameChange).toHaveBeenCalledWith('New Item');

    fireEvent.change(quantityInput, { target: { value: '3' } });
    expect(mockProps.onQuantityChange).toHaveBeenCalledWith(3);

    fireEvent.change(priceInput, { target: { value: '15.99' } });
    expect(mockProps.onPriceChange).toHaveBeenCalledWith(15.99);
  });

  it('calls delete handler when delete button is clicked', () => {
    render(<InvoiceFormItem {...mockProps} />);

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.itemIndex);
  });
});
