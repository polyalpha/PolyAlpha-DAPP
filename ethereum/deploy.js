const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const Config = require('../utils/Config');
const BlockConnector = require('../core/BlockConnector');

async function mainRun() {
    const provider = new HDWalletProvider(
        'crystal hill lonely manual struggle cabin retire abuse cable spell orange predict',
        Config.NETWORK_LIST[1].providerUrl
    );
    const web3 = new Web3(provider);

    let blockConnector = new BlockConnector(web3, []);
    console.log('Start');
    await blockConnector.deploy(false);
    console.log('Done!');
}

mainRun();
