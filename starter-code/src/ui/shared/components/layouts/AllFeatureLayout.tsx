import React, { useState } from 'react';

import { Outlet } from 'react-router-dom';
import { Transition, TransitionChild } from '@headlessui/react'

import { AllFeatureLayoutContext } from '../../../shared/hooks/AllFeatureLayoutContext';
import { InvoiceFormParams, MessageDialogParams } from '../../types/AllFeatureLayout.type';

import LeftNavigationBar from '../organisms/LeftNavigationBar';
import MessageDialog from '../molecules/MessageDialog';

import InvoiceForm from '../../../features/invoice-management/pages/InvoiceForm';

const Layout: React.FC = () => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');
  const [showInvoiceForm, setShowInvoiceForm] = useState<InvoiceFormParams>({
    visible: false,
  });
  const [shouldInvoiceListingRefresh, setShouldInvoiceListingRefresh] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<MessageDialogParams>({
    visible: false,
    title: '',
    message: '',
    onClose: () => {}
  });

  return (
    <AllFeatureLayoutContext.Provider value={{
      theme, setTheme,
      showInvoiceForm, setShowInvoiceForm,
      shouldInvoiceListingRefresh, setShouldInvoiceListingRefresh,
      messageDialog, setMessageDialog
    }}>
      <div className={`flex flex-col min-h-screen ${theme} bg-background-light dark:bg-background-dark`}>
        <div className="z-2">
          <LeftNavigationBar />
        </div>
        <Transition show={showInvoiceForm.visible}>
          <TransitionChild>
            <div
              className="fixed inset-0 bg-black/30 transition duration-300 data-closed:opacity-0"
              onClick={() => setShowInvoiceForm({ visible: false })}
            />
          </TransitionChild>

          {/* Slide-in sidebar */}
          <TransitionChild>
            <div className="fixed z-1 inset-y-0 left-[80px] w-[960px] max-w-[960px] bg-primary-light dark:bg-background-dark transition duration-300 data-closed:-translate-x-full flex justify-center overflow-y-auto">
              <InvoiceForm invoice={showInvoiceForm.invoice} />
            </div>
          </TransitionChild>
        </Transition>

        <Outlet />
      </div>

      <MessageDialog
        title={messageDialog.title}
        message={messageDialog.message}
        isOpen={messageDialog.visible}
        onClose={() => { 
          if (messageDialog.onClose) {
            messageDialog.onClose();
          }
          setMessageDialog({ visible: false, title: '', message: '', onClose: () => {} });
        }}
      />
    </AllFeatureLayoutContext.Provider>
  );
}

export default Layout;
