module.exports = function (RED) {
    // Import the ESM tractive module once at load time
    let tractivePromise = import('../index.js').then(m => m.default);

    function TractiveConfigNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.email = config.email;

        node.getClient = async function () {
            const tractive = await tractivePromise;
            if (!tractive.isAuthenticated()) {
                const ok = await tractive.connect(node.email, node.credentials.password);
                if (!ok) throw new Error('Tractive authentication failed');
            }
            return tractive;
        };
    }

    RED.nodes.registerType('tractive-config', TractiveConfigNode, {
        credentials: {
            password: { type: 'password' }
        }
    });
};
