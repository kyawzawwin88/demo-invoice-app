import { useState, useEffect } from 'react';
import { AuditLog } from '../types/AuditLog.type';
import { AuditLogListingService } from '../services/AuditLogListing.service';

export const useAuditLogListing = (invoiceId: string) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const limit = 10;
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await AuditLogListingService.getAuditLogs(invoiceId, page, limit);
      setLogs(prev => [...prev, ...data.data.auditLogs]);
      setHasMore(data.data.currentPage < data.data.totalPages);
      setTotal(data.data.total);
    } catch (err) {
      setError('Failed to load audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [invoiceId, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };
  return {
    logs,
    loading,
    error,
    refreshLogs: fetchLogs,
    total,
    hasMore,
    handleLoadMore
  };
};