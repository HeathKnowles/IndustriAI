import { useEffect, useState } from 'react';

type AccessDecision = {
  id: number;
  timestamp: string;
  decision: 'allowed' | 'denied';
  message: string;
};

const AccessDecisions: React.FC = () => {
  const [decisions, setDecisions] = useState<AccessDecision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3003/accesses');
        const data = await response.json();
        if (data.length > 0) {
          setDecisions(data);
        } else {
          setDecisions([]);
        }
      } catch (error) {
        console.error('Error fetching access decisions:', error);
        setDecisions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 shadow rounded-md h-64 overflow-y-scroll">
      <h2 className="text-lg font-semibold mb-4">Access Decisions</h2>
      {decisions.length === 0 ? (
      <p>No Access Data Available</p>
      ) : (
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
          - {decision.message}
        </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default AccessDecisions;
