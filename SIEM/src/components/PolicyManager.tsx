import { useState } from 'react';

type Policy = {
  id: number;
  name: string;
};

const PolicyManager: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([
    { id: 1, name: 'Allow Admin Access' },
    { id: 2, name: 'Block Unauthorized Access' },
  ]);
  const [newPolicy, setNewPolicy] = useState('');

  const addPolicy = () => {
    if (newPolicy.trim()) {
      setPolicies([...policies, { id: Date.now(), name: newPolicy }]);
      setNewPolicy('');
    }
  };

  const removePolicy = (id: number) => {
    setPolicies(policies.filter((policy) => policy.id !== id));
  };

  return (
    <div className="bg-white p-4 shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Policy Manager</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newPolicy}
          onChange={(e) => setNewPolicy(e.target.value)}
          placeholder="New policy"
          className="border p-2 w-full rounded-md"
        />
        <button
          onClick={addPolicy}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
        >
          Add Policy
        </button>
      </div>
      <ul>
        {policies.map((policy) => (
          <li key={policy.id} className="flex justify-between mb-2">
            <span>{policy.name}</span>
            <button
              onClick={() => removePolicy(policy.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PolicyManager;
