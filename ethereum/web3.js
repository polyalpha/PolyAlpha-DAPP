const Web3 = require('web3');
const {ENV} = require('../src/_configs');

let web3;

//temporarily set network
ENV.EthNetworkId = 4;

const provider = new Web3.providers.HttpProvider(ENV.ProviderUrl);
web3 = new Web3(provider);

module.exports = web3;