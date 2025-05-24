import React from 'react';

import { InvoiceCardItemsProps } from '../../types/InvoiceDetail.type';

const InvoiceCardItems: React.FC<InvoiceCardItemsProps> = ({ total, items }) => {

  return (
    <div className="bg-surface-darker rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-secondary">Item Name</th>
            <th className="px-6 py-4 text-center text-secondary">QTY.</th>
            <th className="px-6 py-4 text-right text-secondary">Price</th>
            <th className="px-6 py-4 text-right text-secondary">Total</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 font-bold text-text-dark">{item.name}</td>
              <td className="px-6 py-4 text-center text-text-dark">
                {item.quantity}
              </td>
              <td className="px-6 py-4 text-right text-text-dark">
                £ {item.price}
              </td>
              <td className="px-6 py-4 text-right font-bold text-text-dark">
                £{(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr><td colSpan={4}>&nbsp;</td></tr>
        </tbody>
        <tfoot>
          <tr className="bg-black text-white text-sm">
            <td colSpan={3} className="px-6 py-8 text-text-dark">
              Amount Due
            </td>
            <td className="px-6 py-4 text-right text-2xl font-bold text-text-dark">
              £ {total }
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default InvoiceCardItems;
