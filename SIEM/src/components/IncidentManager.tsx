import React, { useState, useEffect } from 'react';

// Type for Incident
type Incident = {
  id: string;
  timestamp: string;
  description: string;
  status: string;
  assignedTo: string;
  severity: string;
};

const IncidentManager: React.FC = () => {
  // Dummy Incident Data
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // Fetch and Set Dummy Incident Data
  useEffect(() => {
    const dummyIncidents: Incident[] = [
      {
        id: '1',
        timestamp: '2025-01-06 14:00',
        description: 'Unauthorized access attempt detected',
        status: 'Open',
        assignedTo: 'John Doe',
        severity: 'High',
      },
      {
        id: '2',
        timestamp: '2025-01-06 14:05',
        description: 'Anomaly in login attempts',
        status: 'In Progress',
        assignedTo: 'Jane Smith',
        severity: 'Medium',
      },
      {
        id: '3',
        timestamp: '2025-01-06 14:10',
        description: 'Phishing email reported',
        status: 'Closed',
        assignedTo: 'Alice Brown',
        severity: 'Low',
      },
    ];

    setIncidents(dummyIncidents);
  }, []);

  return (
    <div className="bg-white p-6 shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Incident Management</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Incident ID</th>
            <th className="px-4 py-2 border-b text-left">Timestamp</th>
            <th className="px-4 py-2 border-b text-left">Description</th>
            <th className="px-4 py-2 border-b text-left">Status</th>
            <th className="px-4 py-2 border-b text-left">Assigned To</th>
            <th className="px-4 py-2 border-b text-left">Severity</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td className="px-4 py-2 border-b">{incident.id}</td>
              <td className="px-4 py-2 border-b">{incident.timestamp}</td>
              <td className="px-4 py-2 border-b">{incident.description}</td>
              <td className="px-4 py-2 border-b">{incident.status}</td>
              <td className="px-4 py-2 border-b">{incident.assignedTo}</td>
              <td className="px-4 py-2 border-b">{incident.severity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentManager;
