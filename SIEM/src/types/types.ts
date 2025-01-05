export type Anomaly = {
    id: number;
    timestamp: string;
    description: string;
};

export type AccessDecision = {
    id: number;
    timestamp: string;
    decision: 'allowed' | 'denied';
    details: string;
};

export type RequestLog = {
    id: number;
    fingerprint: string;
    timestamp: string;
    origin: string;
};
