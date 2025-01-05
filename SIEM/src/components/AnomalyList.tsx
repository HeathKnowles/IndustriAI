import { useEffect, useState } from 'react';

type Anomaly = {
  id: number;
  timestamp: string;
  description: string;
};

const AnomalyList: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    const dummyAnomalies: Anomaly[] = [
      { id: 1, timestamp: '2025-01-06 14:05', description: 'High CPU usage detected in Arbiter.' },
      { id: 2, timestamp: '2025-01-06 14:07', description: 'Unauthorized access attempt flagged by Gatekeeper.' },
    ];
    setAnomalies(dummyAnomalies);
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded-md h-64 overflow-y-scroll">
      <h2 className="text-lg font-semibold mb-4">Anomalies</h2>
      <ul>
        {anomalies.map((anomaly) => (
          <li key={anomaly.id} className="mb-2">
            <span className="font-mono text-gray-500">{anomaly.timestamp}</span> - {anomaly.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnomalyList;
