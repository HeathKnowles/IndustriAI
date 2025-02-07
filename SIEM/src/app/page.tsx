"use client";

import SummaryCard from '../components/SummaryCard';
import LogViewer from '../components/LogViewer';
import AnomalyList from '../components/AnomalyList';
import PolicyManager from '../components/PolicyManager';
import RequestTracker from '../components/RequestTracker';
import AccessDecisions from '../components/AccessDecisions';
import IncidentManager from '../components/IncidentManager'; // Import the new component

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white p-4 rounded-md shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Microservices Dashboard</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <SummaryCard />
          <IncidentManager />
        </div>
        <AnomalyList />
        <AccessDecisions />
        <RequestTracker />
        {/* <LogViewer /> */}
      </main>
    </div>
  );
};

export default Dashboard;
