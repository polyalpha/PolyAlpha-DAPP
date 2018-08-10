import BlockConnector from '../_services/BlockConnector';
import web3 from '../_services/web3';

let blockConnector = new BlockConnector(web3, []);

async function load() {
    await blockConnector.load();
    // How can I update the state from here
}

load();

export function contract(state = blockConnector, action) {
    if (state.contract == undefined) {
        return {};
    }
    return state;
}