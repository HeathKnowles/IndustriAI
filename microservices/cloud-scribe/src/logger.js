const fluentd = require('fluent-logger');

const fluentTag = process.env.FLUENT_TAG || 'cloud-scribe';
const fluentHost = process.env.FLUENT_HOST || 'localhost';
const fluentPort = process.env.FLUENT_PORT || 24224;

const fluentSender = fluentd.createFluentSender(fluentTag, {
  host: fluentHost,
  port: fluentPort,
});

function sendToFluentd(logEntry) {
  fluentSender.emit('log', logEntry, (err) => {
    if (err) throw new Error('Failed to send log to Fluentd.');
  });
}

module.exports = { sendToFluentd };
