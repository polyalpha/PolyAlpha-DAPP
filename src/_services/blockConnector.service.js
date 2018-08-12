const BlockConnector = require('../_services/BlockConnector');
const web3 = require('../_services/web3');
const LocalData = require('../_services/LocalData');

let blockConnector = new BlockConnector(web3, []);

if (LocalData.getAddress() != "") {
    blockConnector.setAccounts([{secretKey: Buffer.from(LocalData.getPrivateKey(), 'hex'), address: LocalData.getAddress()}])
}

blockConnector.load();

module.exports = blockConnector;