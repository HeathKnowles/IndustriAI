import React, { useState, useEffect } from 'react';

// Type for Incident
type Incident = {
  incident_id: string;
  timestamp: string;
  description: string;
  status: string;
  assignedTo: string;
  severity: string;
};

const IncidentManager: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch and Set Incident Data
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('http://localhost:3002/logs');
        if (response.status === 500) {
          setError('No logs available');
          setIncidents([]);
        } else {
          const data: Incident[] = await response.json();
          setIncidents(data);
        }
      } catch (error) {
        setError('Failed to fetch logs');
      }
    };

    fetchIncidents();
  }, []);

  return (
    <div className="bg-white p-6 shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Incident Management</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="overflow-x-auto" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Incident ID</th>
                <th className="px-4 py-2 border-b text-left">Timestamp</th>
                <th className="px-4 py-2 border-b text-left">Description</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Severity</th>
                <th className="px-4 py-2 border-b text-left">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.incident_id}>
                  <td className="px-4 py-2 border-b">{incident.incident_id}</td>
                  <td className="px-4 py-2 border-b">{incident.timestamp}</td>
                  <td className="px-4 py-2 border-b">{incident.description}</td>
                  <td className="px-4 py-2 border-b">{incident.status}</td>
                  <td className="px-4 py-2 border-b">{incident.severity}</td>
                    <td className="px-4 py-2 border-b">{incident.assignedTo || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncidentManager;
