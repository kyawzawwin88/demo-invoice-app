import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAllFeatureLayoutContext } from '../../../../shared/hooks/AllFeatureLayoutContext';

import ConfirmDialog from '../../../../shared/components/molecules/ConfirmDialog';
import { InvoiceDetailProps } from '../../types/InvoiceDetail.type';
import { useInvoiceDetail } from '../../hooks/useInvoiceDetail';

import InvoiceStatusBadge from './InvoiceStatusBadge';

const InvoiceCardActions: React.FC<InvoiceDetailProps> = ({
  invoice,
  onShowAuditLogClick
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { setShowInvoiceForm, setMessageDialog } = useAllFeatureLayoutContext();
  
  const navigate = useNavigate();  

  const { handleMarkAsPaid, handleDelete, error, actionMessage } = useInvoiceDetail(invoice?.id);

  React.useEffect(() => {
    if (!actionMessage) return;
    setMessageDialog({
      visible: true,
      title: 'Success',
      message: actionMessage,
      onClose: () => {
        navigate('/')
      }
    });
  }, [actionMessage]);

  React.useEffect(() => {
    if (!error) return;
    setMessageDialog({
      visible: true,
      title: 'Error',
      message: error,
    });
  }, [error]);

  return (
    <div className="flex justify-between items-center p-6 bg-primary-light dark:bg-surface-darker rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-light dark:text-text-dark">Status</span>
        <InvoiceStatusBadge status={invoice?.status} />
      </div>

      <div className="flex items-center gap-2">
        {(invoice?.status === 'pending' || invoice?.status === 'draft') && (
          <button
            onClick={() => {
              setShowInvoiceForm({
                visible: true,
                invoice: invoice
              });
            }}
            className="px-6 py-3 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
          >
            Edit
          </button>
        )}
        {(invoice?.status === 'pending' || invoice?.status === 'draft') && (
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="px-6 py-3 text-white bg-red-500 rounded-full hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        )}
        {invoice?.status === 'pending' && (
          <button
            onClick={() => setIsConfirmDialogOpen(true)}
            className="px-6 py-3 text-white bg-purple-500 rounded-full hover:bg-purple-600 cursor-pointer"
          >
            Mark as Paid
          </button>
        )}
        <button
            onClick={() => onShowAuditLogClick()}
            className="px-6 py-3 text-white bg-gray-500 rounded-full hover:bg-gray-600 cursor-pointer"
          >
            Show Logs
          </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleMarkAsPaid}
        title="Mark Invoice as Paid"
        message="Are you sure you want to mark this invoice as paid? This action cannot be undone."
        confirmText="Mark as Paid"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={"Are you sure you want to delete invoice #" + invoice?.id + "? This action cannot be undone."}
        confirmText="Delete"
      />
    </div>
  );
};

export default InvoiceCardActions;
