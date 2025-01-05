import VaultClient from 'hashi-vault-js';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fetch = require('node-fetch');

const protoOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
};

const vault = new VaultClient({ 
    endpoint: process.env.VAULT_ADDR || 'http://127.0.0.1:8200',
    token: process.env.VAULT_TOKEN   || ''
});

// Load gRPC Proto file
const packageDefinition = protoLoader.loadSync('cloud_arbiter.proto', protoOptions);
const proto = grpc.loadPackageDefinition(packageDefinition).cloudarbiter;

// Error handler wrapper
const handleGrpcError = (error, callback) => {
    console.error('Error:', error);
    callback({
        code: grpc.status.INTERNAL,
        details: error.message || 'Internal server error'
    });
};

async function getPolicy(call, callback) {
    try {
        const { metadata } = call.request;
        
        if (!metadata) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                details: 'Metadata is required'
            });
            return;
        }

        const response = await vault.read(`secret/data/policies/${metadata}`);
        
        if (!response?.data?.data?.policy) {
            callback({
                code: grpc.status.NOT_FOUND,
                details: 'Policy not found'
            });
            return;
        }

        callback(null, { policy: response.data.data.policy });
    } catch (error) {
        handleGrpcError(error, callback);
    }
}

async function getAttributes(call, callback) {
    try {
        const { userId } = call.request;
        
        if (!userId) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                details: 'User ID is required'
            });
            return;
        }

        const response = await vault.read(`secret/data/attributes/${userId}`);
        
        if (!response?.data?.data) {
            callback({
                code: grpc.status.NOT_FOUND,
                details: 'Attributes not found'
            });
            return;
        }

        callback(null, { attributes: response.data.data });
    } catch (error) {
        handleGrpcError(error, callback);
    }
}

async function evaluatePolicy(policy, metadata) {
    const opaUrl = process.env.OPA_URL || 'http://localhost:8181/v1/data/cloudarbiter/allow';
    
    try {
        const input = {
            policy: policy,
            metadata: metadata,
            timestamp: new Date().toISOString()
        };

        const response = await fetch(opaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input }),
            timeout: 5000
        });

        if (!response.ok) {
            throw new Error(`OPA server responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data.result ? 'ALLOW' : 'DENY';
    } catch (error) {
        console.error('Policy evaluation error:', error);
        throw error;
    }
}

async function postDecision(call, callback) {
    try {
        const { policy, metadata } = call.request;
        
        if (!policy || !metadata) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                details: 'Both policy and metadata are required'
            });
            return;
        }

        const decision = await evaluatePolicy(policy, metadata);
        callback(null, { decision });
    } catch (error) {
        handleGrpcError(error, callback);
    }
}

const server = new grpc.Server();
server.addService(proto.CloudArbiter.service, {
    getPolicy,
    getAttributes,
    postDecision
});

const PORT = process.env.PORT || 50051;
server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error('Failed to bind server:', error);
            process.exit(1);
        }
        console.log(`Server running at http://localhost:${port}`);
        server.start();
    }
);

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    server.tryShutdown(() => {
        console.log('Server shut down successfully');
        process.exit(0);
    });
});