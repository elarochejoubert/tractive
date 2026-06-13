module.exports = function (RED) {
    function TractiveTrackerNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.configNode = RED.nodes.getNode(config.config);
        node.operation = config.operation;
        node.trackerID = config.trackerID;

        node.on('input', async function (msg) {
            if (!node.configNode) {
                node.error('No Tractive config selected', msg);
                return;
            }

            const operation = msg.operation || node.operation;
            const trackerID = msg.trackerID || node.trackerID;

            try {
                node.status({ fill: 'blue', shape: 'dot', text: operation });
                const tractive = await node.configNode.getClient();

                let result;
                switch (operation) {
                    case 'getAllTrackers':
                        result = await tractive.getAllTrackers();
                        break;
                    case 'getTrackerLocation':
                        result = await tractive.getTrackerLocation(trackerID);
                        break;
                    case 'getTrackerHardware':
                        result = await tractive.getTrackerHardware(trackerID);
                        break;
                    case 'getTrackerHistory':
                        result = await tractive.getTrackerHistory(trackerID, msg.from, msg.to);
                        break;
                    case 'getPets':
                        result = await tractive.getPets();
                        break;
                    case 'liveOn':
                        result = await tractive.liveOn(trackerID);
                        break;
                    case 'liveOff':
                        result = await tractive.liveOff(trackerID);
                        break;
                    case 'LEDOn':
                        result = await tractive.LEDOn(trackerID);
                        break;
                    case 'LEDOff':
                        result = await tractive.LEDOff(trackerID);
                        break;
                    case 'buzzerOn':
                        result = await tractive.buzzerOn(trackerID);
                        break;
                    case 'buzzerOff':
                        result = await tractive.buzzerOff(trackerID);
                        break;
                    default:
                        node.error(`Unknown operation: ${operation}`, msg);
                        node.status({ fill: 'red', shape: 'ring', text: 'unknown operation' });
                        return;
                }

                node.status({ fill: 'green', shape: 'dot', text: 'ok' });
                msg.payload = result;
                node.send(msg);
            } catch (err) {
                node.status({ fill: 'red', shape: 'ring', text: err.message });
                node.error(err, msg);
            }
        });
    }

    RED.nodes.registerType('tractive-tracker', TractiveTrackerNode);
};
