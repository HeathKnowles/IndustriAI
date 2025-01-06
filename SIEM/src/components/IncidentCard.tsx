import React from 'react';

interface IncidentProps {
  title: string;
  description: string;
  severity: string;
  status: string;
}

const IncidentCard: React.FC<IncidentProps> = ({ title, description, severity, status }) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <p>{description}</p>
      <p><strong>Severity:</strong> {severity}</p>
      <p><strong>Status:</strong> {status}</p>
    </div>
  );
};

export default IncidentCard;
