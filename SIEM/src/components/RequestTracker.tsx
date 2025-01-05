import { useEffect, useState } from 'react';

type RequestLog = {
  id: number;
  fingerprint: string;
  timestamp: string;
  origin: string;
};

const RequestTracker: React.FC = () => {
  const [requests, setRequests] = useState<RequestLog[]>([]);

  useEffect(() => {
    const dummyRequests: RequestLog[] = [
      { id: 1, fingerprint: 'abc123', timestamp: '2025-01-06 14:05', origin: '192.168.1.10' },
      { id: 2, fingerprint: 'xyz789', timestamp: '2025-01-06 14:06', origin: '192.168.1.15' },
    ];
    setRequests(dummyRequests);
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded-md h-64 overflow-y-scroll">
      <h2 className="text-lg font-semibold mb-4">Request Tracker</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id} className="mb-2">
            <span className="font-mono text-gray-500">{request.timestamp}</span> -{' '}
            <span className="font-bold text-blue-500">{request.fingerprint}</span> from{' '}
            {request.origin}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestTracker;
