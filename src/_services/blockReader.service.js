const web3 = require('./web3');
const {ENV} = require('../_configs/Config');
const BlockReader = require('./BlockReader');
const {store} = require('../_helpers/store');
const {userActions} = require('../_actions/user.actions');

let blockReader = new BlockReader(web3, ENV.ContractAddress, updateHandler);

function updateHandler() {
    console.log('events update handler');
    
    console.log(store);
    store.dispatch(userActions.updateUserList());
}

module.exports = blockReader;