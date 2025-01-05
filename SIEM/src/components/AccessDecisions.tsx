import { useEffect, useState } from 'react';

type AccessDecision = {
  id: number;
  timestamp: string;
  decision: 'allowed' | 'denied';
  details: string;
};

const AccessDecisions: React.FC = () => {
  const [decisions, setDecisions] = useState<AccessDecision[]>([]);

  useEffect(() => {
    const dummyDecisions: AccessDecision[] = [
      { id: 1, timestamp: '2025-01-06 14:00', decision: 'allowed', details: 'User Admin logged in.' },
      { id: 2, timestamp: '2025-01-06 14:03', decision: 'denied', details: 'Blocked access attempt from unknown IP.' },
    ];
    setDecisions(dummyDecisions);
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded-md h-64 overflow-y-scroll">
      <h2 className="text-lg font-semibold mb-4">Access Decisions</h2>
      <ul>
        {decisions.map((decision) => (
          <li key={decision.id} className="mb-2">
            <span className="font-mono text-gray-500">{decision.timestamp}</span> -{' '}
            <span
              className={`font-bold ${
                decision.decision === 'allowed' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {decision.decision.toUpperCase()}
            </span>{' '}
            - {decision.details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccessDecisions;
