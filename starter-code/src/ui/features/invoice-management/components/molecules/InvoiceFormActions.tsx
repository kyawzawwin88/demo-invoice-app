import React from 'react';
import { InvoiceFormActionsProps } from '../../types/InvoiceForm.type';

const InvoiceFormActions: React.FC<InvoiceFormActionsProps> = ({
  isUpdate,
  onDiscard,
  onSaveAsDraft, 
  onSaveAndSend,
  onUpdate
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <button
          onClick={onDiscard}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Discard
        </button>
      </div>
      
      {!isUpdate && 
        <div className="flex gap-4">
          <button
            data-testid="save-as-draft-button"
            onClick={onSaveAsDraft}
            className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            data-testid="save-and-send-button"
            onClick={onSaveAndSend}
            className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors cursor-pointer"
          >
            Save & Send
          </button>
        </div>
      }

      {isUpdate && (
          <button
            onClick={onUpdate}
            className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors cursor-pointer"
          >
            Update
          </button>
        )
      }
    </div>
  );
};

export default InvoiceFormActions;
