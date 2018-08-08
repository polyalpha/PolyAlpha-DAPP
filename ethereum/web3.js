import Web3 from 'web3';
import {ENV} from '../src/_configs';

let web3;

//temporarily set network
ENV.EthNetworkId = 4;

const provider = new Web3.providers.HttpProvider(ENV.ProviderUrl);
web3 = new Web3(provider);

export default web3;