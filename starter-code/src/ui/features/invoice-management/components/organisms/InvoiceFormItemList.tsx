import React, { useState } from 'react';
import ConfirmDialog from '../../../../shared/components/molecules/ConfirmDialog';
import { InvoiceItem } from '../../types/invoiceItem.type';
import InvoiceFormItem from '../molecules/InvoiceFormItem';
import { InvoiceFormItemListProps } from '../../types/InvoiceForm.type';  

const InvoiceFormItemList: React.FC<InvoiceFormItemListProps> = ({ invoiceItems, onItemsChange }) => {
  const [items, setItems] = useState<InvoiceItem[]>(invoiceItems || []);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [itemIndexToDelete, setItemIndexToDelete] = React.useState<number>(-1);

  const addNewItem = () => {
    setItems([
      ...items,
      {
        name: '',
        quantity: 1,
        price: 0,
      }
    ]);
  };

  const handleItemDelete = (itemIndex: number) => {
    setItemIndexToDelete(itemIndex);
    setIsConfirmDialogOpen(true);
  };

  const handleItemChange = (
    itemIndex: number,
    field: 'name' | 'quantity' | 'price',
    value: string | number
  ) => {
    const newItems = items.map((item, index) =>
      index === itemIndex ? { ...item, [field]: value } : item
    );
    setItems(newItems);
    
    if (onItemsChange) {
      onItemsChange(newItems);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5">
          <span className="block text-sm font-medium text-muted">Item Name</span>
        </div>
        <div className="col-span-2">
          <span className="block text-sm font-medium text-muted">Qty.</span>
        </div>
        <div className="col-span-2">
          <span className="block text-sm font-medium text-muted">Price</span>
        </div>
        <div className="col-span-2 text-right">
          <span className="block text-sm font-medium text-muted">Total</span>
        </div>
        <div className="col-span-1">
          <span className="block text-sm font-medium"></span>
        </div>
      </div>

      {items.map((item, index) => (
        <InvoiceFormItem
          key={index}
          itemIndex={index}
          itemName={item.name}
          quantity={item.quantity} 
          price={item.price}
          onItemNameChange={(value) => handleItemChange(index, 'name', value)}
          onQuantityChange={(value) => handleItemChange(index, 'quantity', value)}
          onPriceChange={(value) => handleItemChange(index, 'price', value)}
          onDelete={(itemIndex: number) => handleItemDelete(itemIndex)}
        />
      ))}

      <button
        data-testid="add-new-item-button"
        onClick={addNewItem}
        className="text-text-light dark:text-text-dark w-full py-3 bg-surface-light dark:bg-surface-dark rounded-[50px] hover:bg-surface-light hover:dark:bg-surface-darker transition-colors"
      >
        + Add New Item
      </button>

      <ConfirmDialog
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        isOpen={isConfirmDialogOpen}
        onClose={() => { setIsConfirmDialogOpen(false); }}
        onConfirm={() => {
          const newItems = items.filter((_, index) => index !== itemIndexToDelete);
          setItems(newItems);
          setItemIndexToDelete(-1);
        }}
      />
    </div>
  )
}

export default InvoiceFormItemList;