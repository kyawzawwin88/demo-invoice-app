import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllFeatureLayoutContext } from '../../../shared/hooks/AllFeatureLayoutContext';
import { InvoiceFormService, AllowedCreateInvoiceStatus } from '../services/InvoiceForm.service';
import { Invoice, InvoiceDto } from '../types/Invoice.type';

export const useInvoiceForm = (invoice?: Invoice) => {
  const { setShowInvoiceForm, setShouldInvoiceListingRefresh, setMessageDialog } = useAllFeatureLayoutContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    senderAddress: {
      street: invoice?.senderAddress?.street || '',
      city: invoice?.senderAddress?.city || '',
      postCode: invoice?.senderAddress?.postCode || '',
      country: invoice?.senderAddress?.country || ''
    },
    clientAddress: {
      street: invoice?.clientAddress?.street || '',
      city: invoice?.clientAddress?.city || '',
      postCode: invoice?.clientAddress?.postCode || '',
      country: invoice?.clientAddress?.country || ''
    },
    invoice: {
      clientName: invoice?.clientName || '',
      clientEmail: invoice?.clientEmail || '',
      createdAt: invoice?.createdAt ? new Date(invoice?.createdAt).toISOString().split('T')[0] : '',
      paymentTerms: invoice?.paymentTerms || null,
      description: invoice?.description || '',
    } as InvoiceDto,
    invoiceItems: invoice?.items || []
  });

  const handleSuccess = (message: string) => {
    setMessageDialog({
      visible: true,
      title: 'Success',
      message,
      onClose: () => {
        setShouldInvoiceListingRefresh(true);
        setShowInvoiceForm({ visible: false, invoice: null });
        navigate('/');
      }
    });
  };

  const handleError = (message: string) => {
    setMessageDialog({
      visible: true,
      title: 'Error',
      message
    });
  };

  const handleCreateInvoice = async (status: AllowedCreateInvoiceStatus) => {
    try {
      const data = await InvoiceFormService.createInvoice(formData, status);
      if (data.status_code === 201) {
        handleSuccess(data.status);
      } else {
        handleError(data.status);
      }
    } catch (error) {
      handleError(error.message);
      console.error('Error saving invoice:', error);
    }
  };

  const handleUpdateInvoice = async () => {
    try {
      const data = await InvoiceFormService.updateInvoice(invoice!.id, formData);
      if (data.status_code === 200) {
        handleSuccess(data.status);
      } else {
        handleError(data.status);
      }
    } catch (error) {
      handleError(error.message);
      console.error('Error saving invoice:', error);
    }
  };

  return {
    formData,
    setFormData,
    handleCreateInvoice,
    handleUpdateInvoice
  };
};