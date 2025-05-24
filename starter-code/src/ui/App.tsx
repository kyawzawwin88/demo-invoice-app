import "./tailwind.css";

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AllFeatureLayout from './shared/components/layouts/AllFeatureLayout';
import InvoiceListing from './features/invoice-management/pages/InvoiceListing';
import InvoiceDetail from './features/invoice-management/pages/InvoiceDetail';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found");
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllFeatureLayout />}>
          <Route path="" element={<InvoiceListing />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
