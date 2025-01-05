import { useEffect, useState } from 'react';

type Log = {
  timestamp: string;
  message: string;
};

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  // Dummy Logs Fetch
  useEffect(() => {
    const dummyLogs: Log[] = [
      { timestamp: '2025-01-06 14:00', message: 'Gatekeeper initialized' },
      { timestamp: '2025-01-06 14:01', message: 'Arbiter policy check passed' },
      { timestamp: '2025-01-06 14:02', message: 'Sentinel detected anomaly' },
    ];
    setLogs(dummyLogs);
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded-md h-64 overflow-y-scroll">
      <h2 className="text-lg font-semibold mb-4">Logs Viewer</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx} className="text-sm mb-2">
            <span className="font-mono text-gray-500">{log.timestamp}</span> - {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogViewer;
