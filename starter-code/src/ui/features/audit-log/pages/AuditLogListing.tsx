import React from 'react';

import { formatDateTime } from '../../../shared/utils/formatter';
import { AuditLogTableProps } from '../types/AuditLogListing.type';
import { useAuditLogListing } from '../hooks/useAuditLogListing';
import { LoadingIndicator } from '../../../shared/components/molecules/LoadingIndicator';

export const AuditLogListing: React.FC<AuditLogTableProps> = ({ invoiceId }) => {
  const { logs, loading, error, hasMore, handleLoadMore } = useAuditLogListing(invoiceId);

  if (loading) {
    return <LoadingIndicator />
  }

  if (error) {
    return <div>Error loading audit logs</div>;
  }

  return (
    <div className="overflow-x-auto min-w-full bg-primary-light dark:bg-surface-dark">
      <table className="min-w-full">
        <thead>
          <tr className="bg-primary-default dark:bg-surface-darker hover:bg-primary-default hover:dark:bg-surface-dark transition-colors">
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
              Date Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="border-separate border-spacing-y-4">
          {logs.map((log) => (
            <tr key={log.id} className="bg-primary-light dark:bg-surface-dark hover:bg-primary-light hover:dark:bg-surface-dark transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                {formatDateTime(log.actionAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                {log.message}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${getActionTypeColor(log.actionType)}`}>
                  {log.actionType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        {hasMore && (
          <tfoot>
            <tr>
              <td colSpan={6} className="text-center py-4">
                
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark bg-surface-darker rounded-full hover:bg-surface-dark cursor-pointer"
                >
                  Load More
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

const getActionTypeColor = (actionType: string): string => {
  switch (actionType) {
    case 'created_draft':
      return 'bg-status-draft-bg text-status-draft';
    case 'created_pending':
      return 'bg-status-pending-bg text-status-pending';
    case 'mark_as_paid':
      return 'bg-status-paid-bg text-status-paid';
    case 'updated':
      return 'bg-blue-100 text-blue-800';
    case 'deleted':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
