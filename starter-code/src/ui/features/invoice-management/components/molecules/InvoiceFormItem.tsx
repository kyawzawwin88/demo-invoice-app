import React from 'react';
import IconDelete from '../../../../../../assets/icon-delete.svg';
import Input from '../../../../shared/components/atoms/Input';
import { InvoiceFormItemProps } from '../../types/InvoiceForm.type';

const InvoiceFormItem: React.FC<InvoiceFormItemProps> = ({
  itemIndex,
  itemName,
  quantity,
  price,
  onItemNameChange,
  onQuantityChange,
  onPriceChange,
  onDelete
}) => {
  const total = quantity * price;

  const handleDelete = () => {
    onDelete(itemIndex);
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-center">
      <div className="col-span-5">
        <Input
          type="text"
          value={itemName}
          fullWidth={true}
          onChange={(e) => onItemNameChange(e.target.value)}
          placeholder="Item Name"
        />
      </div>
      
      <div className="col-span-2">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          fullWidth={true}
          placeholder="Qty"
          min="1"
        />
      </div>

      <div className="col-span-2">
        <Input
          type="number"
          value={price}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          fullWidth={true}
          placeholder="Price"
          min="0"
          step="0.01"
        />
      </div>

      <div className="col-span-2">
        <span className="block text-sm font-medium text-text-light dark:text-text-dark text-right">
          £ {total.toFixed(2)}
        </span>
      </div>

      <div className="col-span-1 flex justify-center">
        <button 
          onClick={handleDelete}
          className="cursor-pointer p-2 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-transparent rounded-full transition-colors"
        >
          <img src={IconDelete} alt="Delete" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InvoiceFormItem;
