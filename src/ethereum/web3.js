"use strict";

var Web3 = require('web3');

var _require = require('../src/_configs/Config'),
    ENV = _require.ENV;

var web3; //temporarily set network

ENV.EthNetworkId = 4;
var provider = new Web3.providers.HttpProvider(ENV.ProviderUrl);
web3 = new Web3(provider);
console.log(web3);
module.exports = web3;