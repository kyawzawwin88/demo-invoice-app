import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Transition, TransitionChild } from '@headlessui/react'
import { useAllFeatureLayoutContext } from '../../../shared/hooks/AllFeatureLayoutContext';

import IconArrowLeft from '../../../../../assets/icon-arrow-left.svg';

import { useInvoiceDetail } from '../hooks/useInvoiceDetail';
import { LoadingIndicator } from '../../../shared/components/molecules/LoadingIndicator';

import InvoiceCardActions from '../components/molecules/InvoiceCardActions';
import InvoiceCard from '../components/organisms/InvoiceCard';
import { AuditLogListing } from '../../audit-log/pages/AuditLogListing';

const InvoiceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { setMessageDialog } = useAllFeatureLayoutContext();

  const { id: invoiceId } = useParams<{ id: string }>();
  const { invoice, loading, error, showAuditLog, setShowAuditLog } = useInvoiceDetail(invoiceId!);
  
  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    setMessageDialog({
      visible: true,
      title: 'Error',
      message: error
    });
  }

  return (
    <div className="flex flex-col gap-6 w-[1024px] max-w-[1024px] mx-auto mt-10">
      <section>
        <button 
          data-testid="go-back"
          onClick={() => navigate('/')}
          className="text-text-light dark:text-text-dark flex items-center gap-4 text-sm font-bold hover:opacity-75 transition-opacity cursor-pointer"
        >
          <img src={IconArrowLeft} alt="Go back" className="w-2 h-3" />
          Go back
        </button>
      </section>
      <section>
        <InvoiceCardActions invoice={invoice} onShowAuditLogClick={() => setShowAuditLog(true)} />
      </section>
      
      <section>
        <InvoiceCard invoice={invoice} />
      </section>

      {/* audit log here */}
      <Transition show={showAuditLog}>
        <TransitionChild>
          <div
            className="fixed inset-0 bg-black/30 transition duration-300 data-closed:opacity-0"
            onClick={() => setShowAuditLog(false)}
          />
        </TransitionChild>

        {/* Slide-in sidebar */}
        <TransitionChild>
          <div className="fixed z-1 inset-y-0 right-0 min-h-full w-[650px] max-w-[650px] bg-surface-light dark:bg-surface-dark transition duration-300 data-closed:translate-x-full flex justify-center overflow-y-auto">
            <AuditLogListing invoiceId={invoiceId} />
          </div>
        </TransitionChild>
      </Transition>
    </div>
  );
};

export default InvoiceDetail;
