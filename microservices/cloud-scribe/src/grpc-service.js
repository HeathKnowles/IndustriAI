const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { sendToFluentd } = require('./logger');

const PROTO_PATH = path.resolve(__dirname, '../proto/log.proto');

// Load the protocol buffer definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, // Keeps case as defined in the .proto file
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const logProto = grpc.loadPackageDefinition(packageDefinition).log; // Adjusted path

function collectLog(call, callback) {
  const logEntry = call.request;
  try {
    sendToFluentd(logEntry);
    callback(null, { status: 'Log received and forwarded via gRPC.' });
  } catch (err) {
    console.error(err);
    callback(err);
  }
}

function createGrpcServer() {
  const server = new grpc.Server();
  
  // Ensure correct service reference
  server.addService(logProto.LogService.service, { CollectLog: collectLog });

  const grpcPort = process.env.GRPC_PORT || 50051;
  server.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running on port ${grpcPort}`);
    server.start();
  });
}

module.exports = { createGrpcServer };
