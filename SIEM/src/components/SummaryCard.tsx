import { useState, useEffect } from 'react';

type ServiceStatus = {
  name: string;
  status: 'healthy' | 'unhealthy';
};

const SummaryCard: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);

  // Dummy Data Fetch
  useEffect(() => {
    fetch('http://localhost:3001/allServices')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
      });
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Service Summary</h2>
      {services.length === 0 ? (
        <p>No services for now</p>
      ) : (
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
      )}
    </div>
  );
};

export default SummaryCard;
