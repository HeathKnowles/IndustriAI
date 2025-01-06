// src/services/sumoLogicAPI.ts
import axios from 'axios';

const apiEndpoint = 'https://api.sumologic.com/api'; // Replace with Sumo Logic API endpoint
const accessId = process.env.NEXT_PUBLIC_ACCESS_ID;
const accessKey = process.env.NEXT_PUBLIC_ACCESS_KEY;

const authHeader = {
  headers: {
    'Authorization': 'Basic ' + Buffer.from(accessId + ':' + accessKey).toString('base64'),
    'Content-Type': 'application/json',
  }
};

export const createIncident = async (incidentDetails: object) => {
  try {
    const response = await axios.post(`${apiEndpoint}/v1/incidents`, incidentDetails, authHeader);
    return response.data;
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
};

export const getIncidentLogs = async (incidentId: string) => {
  try {
    const response = await axios.get(`${apiEndpoint}/v1/incidents/${incidentId}/logs`, authHeader);
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};

// Add other API methods as needed...
