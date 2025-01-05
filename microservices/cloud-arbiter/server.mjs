import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import pkg from 'hashi-vault-js';  // Import the entire module
const VaultClient = pkg;  // Directly assign the package to VaultClient
import axios from "axios";

// Load proto file
const packageDefinition = protoLoader.loadSync("cloud_arbiter.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).cloudarbiter;

// Initialize clients
const vault = new VaultClient({
  endpoint: "http://127.0.0.1:8200", // Vault endpoint
  token: process.env.VAULT_TOKEN, // Vault token loaded from .env file
});

const opaClient = axios.create({
  baseURL: "http://localhost:8181", // Default OPA server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility function to evaluate policy using OPA
async function evaluateWithOPA(policyName, metadata) {
  try {
    const response = await opaClient.post("/v1/data/" + policyName, {
      input: {
        metadata: metadata,
        timestamp: new Date().toISOString(),
      },
    });

    // OPA returns a decision object with allow/deny
    const result = response.data?.result;
    if (result?.allow === true) {
      return "ALLOW";
    }
    return "DENY";
  } catch (error) {
    console.error("OPA evaluation error:", error);
    throw new Error("Policy evaluation failed");
  }
}

// Get policy from Vault
async function getPolicy(call, callback) {
  try {
    const metadata = call.request.metadata;
    if (!metadata) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Metadata is required",
      });
      return;
    }

    const response = await vault.read(`secret/data/policies/${metadata}`);

    if (!response?.data?.data?.policy) {
      throw new Error("Policy not found");
    }

    callback(null, { policy: response.data.data.policy });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: "Error retrieving policy: " + error.message,
    });
  }
}

// Evaluate policy using OPA
async function postDecision(call, callback) {
  try {
    const { policy, metadata } = call.request;

    if (!policy || !metadata) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Both policy and metadata are required",
      });
      return;
    }

    // Extract policy name from the policy document
    const policyName = policy.name || "default";

    // Evaluate using OPA
    const decision = await evaluateWithOPA(policyName, metadata);

    callback(null, { decision });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: "Decision evaluation failed: " + error.message,
    });
  }
}

// Create and start the gRPC server
const server = new grpc.Server();
server.addService(proto.CloudArbiter.service, { getPolicy, postDecision });

const PORT = process.env.PORT || 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to bind server:", error);
      process.exit(1);
    }
    server.start();
    console.log(`Server running at http://localhost:${port}`);
  },
);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down server...");
  server.tryShutdown(() => {
    console.log("Server shutdown successfully");
    process.exit(0);
  });
});
