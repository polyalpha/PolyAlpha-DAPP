import BlockConnector from '../_services/BlockConnector';
import web3 from '../_services/web3';
import LocalData from '../_services/LocalData';

let blockConnector = new BlockConnector(web3, []);

if (LocalData.getAddress() != "") {
    blockConnector.setAccounts([{secretKey: Buffer.from(LocalData.getPrivateKey(), 'hex'), address: LocalData.getAddress()}])
}

async function load() {
    await blockConnector.load();
    console.log('Connected to ethereum network. Contract loaded at: ' + blockConnector.contract.options.address);
}

load();

export function contract(state = blockConnector, action) {
    // if (state.contract == undefined) {
    //     return state;
    // }
    return state;
}