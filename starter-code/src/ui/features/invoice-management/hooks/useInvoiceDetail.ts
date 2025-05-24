import { useState, useEffect } from 'react';
import { InvoiceDetailService } from '../services/InvoiceDetail.service';

export const useInvoiceDetail = (invoiceId: string) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const fetchInvoiceDetail = async () => {
    try {
      setLoading(true);
      const data = await InvoiceDetailService.getInvoiceDetail(invoiceId);
      if (data) {
        setInvoice(data.data);
      } else {
        setError('Invoice not found');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      const invoiceUpdated = await InvoiceDetailService.updatePendingInvoiceAsPaid(invoiceId);
      if (invoiceUpdated.status_code == 200) {
        setActionMessage("You've marked pending invoice #" + invoiceId + ", as paid");
      } else {
        setError('Failed to mark pending invoice as paid');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      setError('Failed to mark pending invoice as paid');
    }
  };

  const handleDelete = async () => {
    try {
      const invoiceDeleted = await InvoiceDetailService.deleteInvoice(invoiceId);
      if (invoiceDeleted.status_code == 200) {
        setActionMessage("You've deleted the invoice #" + invoiceId);
      } else {
        setError('Failed to delete invoice #' + invoiceId);
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      setError('Failed to delete invoice #' + invoiceId);
    }
  };

  useEffect(() => {
    fetchInvoiceDetail();
  }, [invoiceId]);

  return {
    invoice,
    loading,
    error,
    actionMessage,
    handleMarkAsPaid,
    handleDelete,
    refreshInvoice: fetchInvoiceDetail,
    showAuditLog,
    setShowAuditLog
  };
};