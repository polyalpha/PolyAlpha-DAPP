const web3 = require('./web3');
const {ENV} = require('../_configs/Config');
const BlockReader = require('./BlockReader');

let blockReader = new BlockReader(web3, ENV.ContractAddress);
blockReader.initialize();

console.log('load blockreader service');

module.exports = blockReader;