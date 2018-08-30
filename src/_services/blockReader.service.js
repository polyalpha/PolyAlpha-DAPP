const web3 = require('./web3');
const {ENV} = require('../_configs/Config');
const BlockReader = require('./BlockReader');
const {store} = require('../_helpers/store');
const {userActions} = require('../_actions/user.actions');
const ErrorModal = require('../containers/Modal/ErrorModal').default;

let blockReader = new BlockReader(web3, ENV.ContractAddress, updateHandler, errorHandler);

function updateHandler() {
    store.dispatch(userActions.updateUserList());
}

function errorHandler(err) {
    console.log(err.message);
    if (err.message.indexOf("Invalid JSON RPC response: \"\"") !== -1) {
        ErrorModal.show("Unable to connect to Ethereum network. Please check your internet connection and try again!", () => {
            // on modal close
            window.location.reload();
        });
    } else {
        ErrorModal.show(err.message);
    }
}

module.exports = blockReader;