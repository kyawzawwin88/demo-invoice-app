import React from 'react';

import { useAllFeatureLayoutContext } from '../../../shared/hooks/AllFeatureLayoutContext'; 
import Input from '../../../shared/components/atoms/Input';
import Select from '../../../shared/components/atoms/Select';
import { InvoiceFormProps } from '../types/InvoiceForm.type';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { AllowedCreateInvoiceStatus } from '../services/InvoiceForm.service';
import InvoiceFormItemList from '../components/organisms/InvoiceFormItemList';
import InvoiceFormAddress from '../components/molecules/InvoiceFormAddress';
import InvoiceFormActions from '../components/molecules/InvoiceFormActions';
import { InvoiceStatus, PaymentTerms } from '../types/Invoice.type';

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice }) => {
  const { setShowInvoiceForm } = useAllFeatureLayoutContext();
  const {
    formData,
    setFormData,
    handleCreateInvoice,
    handleUpdateInvoice
  } = useInvoiceForm(invoice);

  const placeholder = 'Select payment terms';

  return (
    <div className="flex flex-col gap-8 w-[720px] max-w-[720px] py-10">
      <header>
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
          {invoice ? `Edit #${invoice.id}` : 'New Invoice'}
        </h1>
      </header>
      <section data-testid="bill-from-section">
        <h2 className="text-text-dark dark:text-primary-light font-bold mb-6">Bill From</h2>
        <InvoiceFormAddress
          streetAddress={formData.senderAddress.street}
          city={formData.senderAddress.city}
          postCode={formData.senderAddress.postCode}
          country={formData.senderAddress.country}
          onStreetAddressChange={(value) => setFormData(prev => ({
            ...prev,
            senderAddress: { ...prev.senderAddress, street: value }
          }))}
          onCityChange={(value) => setFormData(prev => ({
            ...prev,
            senderAddress: { ...prev.senderAddress, city: value }
          }))}
          onPostCodeChange={(value) => setFormData(prev => ({
            ...prev,
            senderAddress: { ...prev.senderAddress, postCode: value }
          }))}
          onCountryChange={(value) => setFormData(prev => ({
            ...prev,
            senderAddress: { ...prev.senderAddress, country: value }
          }))}
        />
      </section>

      <section data-testid="bill-to-section">
        <h2 className="text-text-dark dark:text-primary-light font-bold mb-6">Bill To</h2>
        <div className="space-y-6">
          <div className="grid grid-rows-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Client's Name
              </label>
              <Input
                data-testid="clientName"
                type="text"
                value={formData.invoice.clientName}
                fullWidth={true}
                onChange={(e) => setFormData(prev => ({ ...prev, invoice: { ...prev.invoice, clientName: e.target.value } }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Client's Email
              </label>
              <Input
                data-testid="clientEmail"
                type="email"
                value={formData.invoice.clientEmail}
                fullWidth={true}
                onChange={(e) => setFormData(prev => ({ ...prev, invoice: { ...prev.invoice, clientEmail: e.target.value } }))}
              />
            </div>
          </div>

          <InvoiceFormAddress
            streetAddress={formData.clientAddress.street}
            city={formData.clientAddress.city}
            postCode={formData.clientAddress.postCode}
            country={formData.clientAddress.country}
            onStreetAddressChange={(value) => setFormData(prev => ({
              ...prev,
              clientAddress: { ...prev.clientAddress, street: value }
            }))}
            onCityChange={(value) => setFormData(prev => ({
              ...prev,
              clientAddress: { ...prev.clientAddress, city: value }
            }))}
            onPostCodeChange={(value) => setFormData(prev => ({
              ...prev,
              clientAddress: { ...prev.clientAddress, postCode: value }
            }))}
            onCountryChange={(value) => setFormData(prev => ({
              ...prev,
              clientAddress: { ...prev.clientAddress, country: value }
            }))}
          />
        </div>
      </section>

      <section>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Issue Date
              </label>
              <Input
                type="date"
                value={formData.invoice.createdAt}
                fullWidth={true}
                onChange={(e) => setFormData(prev => ({ ...prev, invoice: { ...prev.invoice, createdAt: e.target.value } }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Payment Terms
              </label>
              <Select
                data-testid="paymentTerms"
                fullWidth={true}
                value={formData.invoice.paymentTerms as unknown as string}
                options={[
                  { label: placeholder, value: '' },
                  { label: 'Net 1 Day', value: PaymentTerms.ONE_DAY as unknown as string },
                  { label: 'Net 7 Days', value: PaymentTerms.SEVEN_DAYS as unknown as string },
                  { label: 'Net 30 Days', value: PaymentTerms.THIRTY_DAYS as unknown as string }
                ]}
                onSelectMenuItem={(status: string) => {
                  setFormData(prev => ({ ...prev, invoice: { ...prev.invoice, paymentTerms: status as unknown as PaymentTerms } }));
                }}
                placeholder={placeholder}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Project Description
            </label>
            <Input
              data-testid="projectDescription"
              type="text"
              value={formData.invoice.description}
              fullWidth={true}
              onChange={(e) => setFormData(prev => ({ ...prev, invoice: { ...prev.invoice, description: e.target.value } }))}
            />
          </div>
        </div>
      </section>

      <section data-testid="invoice-item-list">
        <h2 className="text-lg font-bold text-text-dark dark:text-secondary mb-6">Item List</h2>
        <InvoiceFormItemList invoiceItems={formData.invoiceItems} onItemsChange={(items) => setFormData(prev => ({ ...prev, invoiceItems: items }))} />
      </section>

      <section className="mt-8 pb-4">
        <InvoiceFormActions
          isUpdate={invoice?.id ? true : false}
          onDiscard={() => { setShowInvoiceForm({ visible: false }); }}
          onSaveAsDraft={() => handleCreateInvoice(InvoiceStatus.DRAFT as AllowedCreateInvoiceStatus)}
          onSaveAndSend={() => handleCreateInvoice(InvoiceStatus.PENDING as AllowedCreateInvoiceStatus)}
          onUpdate={() => handleUpdateInvoice()}
        />
      </section>
    </div>
  );
};

export default InvoiceForm;
