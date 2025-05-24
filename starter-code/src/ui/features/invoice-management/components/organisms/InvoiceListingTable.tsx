import React from 'react';
import IconArrowRight from '../../../../../../assets/icon-arrow-right.svg';

import { useNavigate } from 'react-router-dom';
import { InvoiceListingTableProps } from '../../types/InvoiceListing.type';
import { formatAmount, formatDate } from '../../../../shared/utils/formatter';
import { LoadingIndicator } from '../../../../shared/components/molecules/LoadingIndicator';

import InvoiceStatusBadge from '../molecules/InvoiceStatusBadge';

const InvoiceListingTable: React.FC<InvoiceListingTableProps> = ({
  onLoadMore,
  invoices,
  hasMore,
  loading
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      {!loading && (
        <table className="min-w-full border-separate border-spacing-y-4" data-testid="invoice-listing-table">
          <tbody className="space-y-2.5">
            {invoices.map((invoice) => (
              <tr
                data-testid="invoice-row"
                key={invoice.id}
                className="bg-primary-light dark:bg-surface-darker hover:bg-primary-default hover:dark:bg-surface-dark cursor-pointer transition-colors"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                <td className="text-text-dark px-6 py-4 whitespace-nowrap text-sm font-bold rounded-tl-lg rounded-bl-lg">
                  #{invoice.id}
                </td>
                <td className="text-text-dark px-6 py-4 whitespace-nowrap text-sm">
                  {
                    invoice.paymentDue &&
                    (
                      <span>
                        Due {formatDate(invoice.paymentDue)}
                      </span>
                    )
                  }
                </td>
                <td className="text-text-dark px-6 py-4 whitespace-nowrap text-sm">
                  {invoice.clientName}
                </td>
                <td className="text-text-dark px-6 py-4 whitespace-nowrap text-base font-bold text-right">
                  {formatAmount(invoice.total)}
                </td>
                <td className="text-text-dark px-6 py-4 whitespace-nowrap">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td className="text-text-dark px-6 py-4 whitespace-nowrap text-right text-sm font-medium rounded-tr-lg rounded-br-lg">
                  <img 
                    src={IconArrowRight} 
                    alt="View invoice" 
                    className="w-2 h-3 cursor-pointer hover:opacity-75 transition-opacity"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          {hasMore && (
            <tfoot>
              <tr>
                <td colSpan={6} className="text-center py-4">
                  
                  <button
                    onClick={onLoadMore}
                    className="px-4 py-2 text-sm font-medium text-text-dark bg-primary-light dark:bg-surface-darker rounded-full hover:bg-primary-default hover:dark:bg-surface-dark cursor-pointer"
                  >
                    Load More
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      )}
      {loading && (
        <LoadingIndicator />
      )}
    </div>
  );
};

export default InvoiceListingTable;
