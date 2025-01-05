import { useState, useEffect } from 'react';

type ServiceStatus = {
  name: string;
  status: 'healthy' | 'unhealthy';
};

const SummaryCard: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);

  // Dummy Data Fetch
  useEffect(() => {
    const dummyServices: ServiceStatus[] = [
      { name: 'Gatekeeper', status: 'healthy' },
      { name: 'Arbiter', status: 'healthy' },
      { name: 'Identifier', status: 'unhealthy' },
      { name: 'Scribe', status: 'healthy' },
      { name: 'Vault', status: 'healthy' },
      { name: 'Sentinel', status: 'unhealthy' },
    ];
    setServices(dummyServices);
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Service Summary</h2>
      <ul>
        {services.map((service, idx) => (
          <li key={idx} className="flex justify-between mb-2">
            <span>{service.name}</span>
            <span
              className={`font-bold ${service.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`}
            >
              {service.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryCard;
