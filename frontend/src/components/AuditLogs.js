import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../api/api'; // Use api.js client
import { toast } from 'react-hot-toast';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getAuditLogs(page); // Call real API
        // Handle both array and object responses
        const logsData = Array.isArray(response.data) ? response.data : response.data.logs;
        setLogs(logsData || []);
        setTotalPages(response.data.pages || 1);
      } catch (error) {
        toast.error('Error fetching audit logs');
      }
    };
    fetchLogs();
  }, [page]);

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Action</th>
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(logs) && logs.length > 0 ? logs.map((log) => (
              <tr key={log.id}>
                <td className="py-2 px-4 border">{log.action}</td>
                <td className="py-2 px-4 border">{log.user}</td>
                <td className="py-2 px-4 border">{log.timestamp}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="py-4 px-4 border text-center text-gray-500">
                  No audit logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 text-white p-2 rounded mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;