// Copyright (c) 2018 Nguyen Vu Nhat Minh
// Distributed under the MIT software license, see the accompanying file LICENSE

const EventEmitter = require('events');
const {ENV} = require('../src/_configs/Config');
const Tx = require('ethereumjs-tx');
const {txConstants} = require('../src/_constants/tx.constants');

class TransactionsManager {
    constructor(web3, account, askForTransactionApproval) {
        this.web3 = web3;
        this.account = account;
        this.askForTransactionApproval = askForTransactionApproval;
        this.numPendingTx = 0;      // Number of pending Ethereum transactions
        this.emitterMapping = {};   // A mapping of an increamental id with an event emitter in order
                                    // to emit user approval and transaction results.

        this.emitterIncrementalId = 0; // will be increased everytime executeMethod get called
        // this.dispatcher = new Dispatcher();

        // this.dispatcher.register((payload) => {
        //     if (payload.action == Constant.ACTION.APPROVE_TRANSACTION) {
        //         this.approveTransaction(payload.transactionId, payload.gasPrice, payload.gasAmount, payload.method);
        //     } else if (payload.action == Constant.ACTION.REJECT_TRANSACTION) {
        //         this.rejectTransaction(payload.transactionId);
        //     }
        // })
    }

    // /**
    //  * @description Get called when user click on Approve button from a TransactionModal
    //  */
    async approveTransaction(transactionId, gasPrice, gasAmount, method) {
        var emitter = this.emitterMapping[transactionId];

        var data = method.encodeABI();
        var transactionCount = await this.web3.eth.getTransactionCount(this.account.address);

        console.log('send transaction to: ' + ENV.ContractAddress);

        var rawTx = {
            nonce: parseInt(transactionCount + this.numPendingTx),
            gasPrice: parseInt(gasPrice),
            gasLimit: parseInt(gasAmount),
            to: ENV.ContractAddress,
            value: 0,
            data: data
        }
        var tx = new Tx(rawTx);
        tx.sign(this.account.secretKey);
        var serializedTx = tx.serialize();
        var txHash =  '0x' + tx.hash().toString('hex');

        this.updatePendingTx(this.numPendingTx+1);
        console.log('Raw transaction: ' + serializedTx.toString('hex'));
        emitter.emit(txConstants.ON_APPROVE, txHash);
        this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                .on('receipt', (receipt) => {
                    this.updatePendingTx(this.numPendingTx-1);
                    emitter.emit(txConstants.ON_RECEIPT, receipt);
                }).on('error', (err, txHash) => {
                    if (err.message.indexOf('insufficient funds') !== -1) {
                        err.message = 'Insufficient funds. Account you try to send transaction from does not have enough funds.';
                    } else if (err.message.indexOf('Transaction ran out of gas') !== -1) {
                        err.message = 'Transaction failed. Please contact our team for assistance.'
                    }
                    this.updatePendingTx(this.numPendingTx-1);
                    emitter.emit(txConstants.ON_ERROR, err, txHash);
                });
    }

    /**
     * @description Get called when user click on Approve button from a TransactionModal
     */
    rejectTransaction(transactionId) {
        var emitter = this.emitterMapping[transactionId];
        emitter.emit(txConstants.ON_REJECTED);

        delete this.emitterMapping[transactionId];
    }

    updatePendingTx(numPendingTx) {
        this.numPendingTx = numPendingTx;
        // this.dispatcher.dispatch({
        //     action: txConstants.PENDING_TRANSACTION_UPDATED,
        //     numPendingTx: this.numPendingTx
        // });
    }

    /**
     * @description Execute a web3's method by signing and sending the raw transaction to EtherChat contract.
     * @param {*} method Web3 contract method instance, which contains method's parameters.
     */
    executeMethod(method) {
        this.emitterIncrementalId++;
        var emitter = new EventEmitter();
        this.emitterMapping[this.emitterIncrementalId] = emitter;

        if (this.askForTransactionApproval) {
            // this.dispatcher.dispatch({
            //     action: Constant.ACTION.OPEN_TRANSACTION_MODAL,
            //     method: method,
            //     transactionId: this.emitterIncrementalId
            // });
        } else {
            this.automaticallyApproveTransaction(this.emitterIncrementalId, method);
        }

        return emitter;
    }

    /**
     * @description Approve a transaction without asking for user permission. Gas price will be
     * calculated automatically
     */
    async automaticallyApproveTransaction(transactionId, method) {
        var estimatedGas;
        try {
            estimatedGas = await method.estimateGas({
                gas: 3000000,
            });
        } catch(err) {
            estimatedGas = 3000000;
        }
        console.log(this.web3);
        var gasPrice = await this.web3.eth.getGasPrice();
        this.approveTransaction(transactionId, gasPrice, estimatedGas, method);
    }
}

module.exports = TransactionsManager;
