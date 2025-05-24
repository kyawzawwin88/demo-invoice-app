import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import InvoiceFormItemList from './InvoiceFormItemList';
import { AllFeatureLayoutContext } from '../../../../shared/hooks/AllFeatureLayoutContext';

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <AllFeatureLayoutContext.Provider value={{
      setMessageDialog: vi.fn(),
      setShowInvoiceForm: vi.fn(),
      setShouldInvoiceListingRefresh: vi.fn(),
      theme: 'light',
      setTheme: vi.fn(),
      showInvoiceForm: { visible: false },
      shouldInvoiceListingRefresh: false,
      messageDialog: { visible: false, title: '', message: '', onClose: vi.fn() }
    }}>
      {ui}
    </AllFeatureLayoutContext.Provider>
  );
};

describe('InvoiceFormItemList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty list initially', () => {
    renderWithContext(<InvoiceFormItemList onItemsChange={vi.fn()} />);
    
    expect(screen.getByText('Item Name')).toBeInTheDocument();
    expect(screen.getByText('Qty.')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('+ Add New Item')).toBeInTheDocument();
  });

  it('adds new item when add button is clicked', () => {
    renderWithContext(<InvoiceFormItemList onItemsChange={vi.fn()} />);
    
    const addButton = screen.getByText('+ Add New Item');
    fireEvent.click(addButton);

    // Should render an InvoiceFormItem component
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // Item name input
  });

  it('opens confirm dialog when delete is clicked', () => {
    renderWithContext(<InvoiceFormItemList onItemsChange={vi.fn()} />);
    
    // Add an item first
    const addButton = screen.getByText('+ Add New Item');
    fireEvent.click(addButton);

    // Click delete on the item
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Confirm dialog should appear
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
  });

  it('deletes item when confirmed in dialog', () => {
    renderWithContext(<InvoiceFormItemList onItemsChange={vi.fn()} />);
    
    // Add an item
    const addButton = screen.getByText('+ Add New Item');
    fireEvent.click(addButton);

    // Delete the item
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Item should be removed
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('updates item when values change', () => {
    renderWithContext(<InvoiceFormItemList onItemsChange={vi.fn()} />);
    
    // Add an item
    const addButton = screen.getByText('+ Add New Item');
    fireEvent.click(addButton);

    // Change item name
    const nameInput = screen.getByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'New Item Name' } });

    // Verify the input value was updated
    expect(screen.getByDisplayValue('New Item Name')).toBeInTheDocument();
  });
});
