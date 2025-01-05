import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { VaultClient } from "hashi-vault-js";
import axios from "axios";

// Load proto file
const packageDefinition = protoLoader.loadSync("cloud_arbiter.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).cloudarbiter;

// Initialize clients
const vault = new VaultClient({ endpoint: "http://127.0.0.1:8200" });
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
