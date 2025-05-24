import React from 'react';
import Select, { SelectVariant } from '../../../../shared/components/atoms/Select';
import IconPlus from '../../../../../../assets/icon-plus.svg';
import { useAllFeatureLayoutContext } from '../../../../shared/hooks/AllFeatureLayoutContext';
import { InvoiceListingToolbarProps } from '../../types/InvoiceListing.type';

const InvoiceListingToolbar: React.FC<InvoiceListingToolbarProps> = ({ totalInvoices = 0, onSelectedMenuItemChange, shouldInvoiceListingRefresh }) => {
  const { setShowInvoiceForm } = useAllFeatureLayoutContext();
  const [selectedFilterStatus, setSelectedFilterStatus] = React.useState('');
  const placeholder = 'Filter by status';

  // reset selected filter status when shouldInvoiceListingRefresh is true
  React.useEffect(() => {
    if (!shouldInvoiceListingRefresh) return;

    setSelectedFilterStatus('');
  }, [shouldInvoiceListingRefresh]);

  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Invoices</h1>
        <p className="text-sm text-gray-500 text-text-light dark:text-text-dark mt-1">
          There are {totalInvoices} total invoices
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select
          variant={SelectVariant.Outline}
          value={selectedFilterStatus}
          options={[
            { label: placeholder, value: '' },
            { label: 'Draft', value: 'draft' },
            { label: 'Pending', value: 'pending' },
            { label: 'Paid', value: 'paid' }
          ]}
          onSelectMenuItem={(status: string) => {
            setSelectedFilterStatus(status);
            onSelectedMenuItemChange(status);
          }}
          placeholder={placeholder}
        />
        
        <button
          className="bg-primary-light text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors flex justify-between items-center w-[160px] cursor-pointer"
          onClick={() => { setShowInvoiceForm({ visible: true }); }}
        >
          <div className="bg-background-light w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
            <img src={IconPlus} alt="New Invoice" />
          </div>
          <label className="cursor-pointer">New Invoice</label>
        </button>
      </div>
    </div>
  );
};

export default InvoiceListingToolbar;
