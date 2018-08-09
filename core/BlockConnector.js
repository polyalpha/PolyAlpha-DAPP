const Utils = require('../utils/Utils');
const {ENV} = require('../src/_configs');
const TransactionManager = require('./TransactionManager');

class BlockConnector {
    constructor(web3, accountObjects, isTesting = false) {
        this.web3 = web3;
        this.accountObjects = accountObjects;
        this.isTesting = isTesting;
        if (isTesting == false && accountObjects.length > 0) {
            this.transactionManager = new TransactionManager(accountObjects[0], false);
        }
        this.contract;
        this.tokenContract;
        this.userContract;
        this.messagingContract;
        this.bidContract;
        this.accounts;
        this.decimals = 100000000;
        this.defaultGas = 5000000;
    }

    async load() {
        this.accounts = await this.web3.eth.getAccounts();

        console.log(this.accounts);

        const compiledContract = require('../ethereum/build/PACore.json');
        this.contract = await new this.web3.eth.Contract(JSON.parse(compiledContract.interface), ENV.ContractAddress);
    }

    async deploy() {
        this.accounts = await this.web3.eth.getAccounts();
    
        const compiledTokenContract = require('../ethereum/build/PAToken.json');
        this.tokenContract = await new this.web3.eth.Contract(JSON.parse(compiledTokenContract.interface))
            .deploy({data: compiledTokenContract.bytecode, arguments: [1000000000 * this.decimals, 'PolyAlpha Demo Token', 8, 'PATD']})
            .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Deployed PAToken contract at: ' + this.tokenContract.options.address);
    
        const compiledUserContract = require('../ethereum/build/PAUser.json');
        this.userContract = await new this.web3.eth.Contract(JSON.parse(compiledUserContract.interface))
            .deploy({data: compiledUserContract.bytecode, arguments: []})
            .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Deployed PAUser contract at: ' + this.userContract.options.address);
    
        const compiledBidContract = require('../ethereum/build/PAAttentionBidding.json');
        this.bidContract = await new this.web3.eth.Contract(JSON.parse(compiledBidContract.interface))
            .deploy({data: compiledBidContract.bytecode, arguments: [this.userContract.options.address, this.tokenContract.options.address]})
            .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Deployed PAAttentionBidding contract at: ' + this.bidContract.options.address);
        
        const compiledMessagingContract = require('../ethereum/build/PAMessaging.json');
        this.messagingContract = await new this.web3.eth.Contract(JSON.parse(compiledMessagingContract.interface))
            .deploy({data: compiledMessagingContract.bytecode, arguments: [this.bidContract.options.address]})
            .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Deployed PAMessaging contract at: ' + this.messagingContract.options.address);

        const compiledContract = require('../ethereum/build/PACore.json');
        this.contract = await new this.web3.eth.Contract(JSON.parse(compiledContract.interface))
                        .deploy({
                            data: compiledContract.bytecode,
                            arguments: [
                                this.userContract.options.address,
                                this.bidContract.options.address,
                                this.messagingContract.options.address
                            ]
                        })
                        .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Deployed PACore contract at: ' + this.contract.options.address);

        await this.tokenContract.methods.transferOwnership(this.bidContract.options.address)
            .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Tranferred token contract to core contract');
        await this.userContract.methods.transferOwnership(this.contract.options.address)
            .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Tranferred user contract to core contract');
        await this.bidContract.methods.transferOwnership(this.contract.options.address)
            .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Tranferred bid contract to core contract');
        await this.messagingContract.methods.transferOwnership(this.contract.options.address)
            .send({from: this.accounts[0], gas: this.defaultGas});
        if (!this.isTesting) console.log('Tranferred messaging contract to core contract');

        if (this.isTesting) {
            await this.tokenContract.methods.transfer(this.accounts[1], 1000*this.decimals)
                .send({from: this.accounts[0], gas: this.defaultGas});
            await this.tokenContract.methods.transfer(this.accounts[2], 1000*this.decimals)
                .send({from: this.accounts[0], gas: this.defaultGas});
            await this.tokenContract.methods.transfer(this.accounts[3], 1000*this.decimals)
                .send({from: this.accounts[0], gas: this.defaultGas});
        }
    }

    async isRegistered(fromAccountId = 0) {
        return await this.contract.methods.isRegistered(this.accounts[fromAccountId]).call();
    }

    async isUserAvailable(fromAccountId = 0) {
        return await this.contract.methods.isUserAvailable(this.accounts[fromAccountId]).call();
    }

    async isUsernameAvailable(username) {
        return await this.contract.methods.isUsernameAvailable(Utils.stringToHex(username)).call();
    }

    async getAccount(fromAccountId = 0) {
        return await this.contract.methods.getUser(this.accounts[fromAccountId]).call();
    }

    async sendTransaction(method, fromAccountId) {
        if (this.isTesting) {
            await method.send({from: this.accounts[fromAccountId], gas: this.defaultGas});
        } else {
            return this.transactionManager.executeMethod(method);
        }
    }
    
    async register(username, name, avatarUrl, extra = "", fromAccountId = 0) {
        let publicKey = Utils.privateToPublic(this.accountObjects[fromAccountId].secretKey);
        var publicKeyLeft = '0x' + publicKey.toString('hex', 0, 32);
        var publicKeyRight = '0x' + publicKey.toString('hex', 32, 64);

        return await this.sendTransaction(this.contract.methods.register(publicKeyLeft, publicKeyRight, Utils.stringToHex(username), 
            Utils.stringToHex(name), Utils.stringToHex(avatarUrl), Utils.stringToHex(extra)), fromAccountId);
    }

    async updateAvailability(availability, fromAccountId = 0) {
        await this.sendTransaction(this.contract.methods.updateAvailability(availability), fromAccountId);
    }

    async updateProfile(username, name, avatarUrl, extra = "", fromAccountId = 0) {
        await this.sendTransaction(this.contract.methods.updateProfile(Utils.stringToHex(username), Utils.stringToHex(name), 
            Utils.stringToHex(avatarUrl), Utils.stringToHex(extra)), fromAccountId);
    }

    async getBid(toId, fromAccountId = 0) {
        return await this.contract.methods.getBid(this.accounts[fromAccountId], this.accounts[toId]).call();
    }

    async createBid(toId, tokenAmount, message = "", fromAccountId = 0) {
        await this.sendTransaction(this.contract.methods.createBid(this.accounts[toId], tokenAmount, Utils.stringToHex(message)), fromAccountId);
    }

    async cancelBid(toId, fromAccountId = 0) {
        await this.sendTransaction(this.contract.methods.cancelBid(this.accounts[toId]), fromAccountId);
    }

    async acceptBid(fromId, message = "", fromAccountId = 0) {
        await this.sendTransaction(this.contract.methods.acceptBid(this.accounts[fromId], Utils.stringToHex(message)), fromAccountId);
    }

    async blockBid(fromId, fromAccountId = 0) {
        await this.sendTransaction(this.contract.methods.blockBid(this.accounts[fromId]), fromAccountId);
    }

    async sendMessage(toId, message, fromAccountId = 0) {
        await this.sendTransaction(this.contract.methods.sendMessage(this.accounts[toId], Utils.stringToHex(message)), fromAccountId);
    }

    async isFailed(params, methodName) {
        var hasError = false;
        try {
            await this[methodName](...params);
        } catch (err) {
            hasError = true;
            console.log(err.message);
        }
        return hasError;
    }
}

module.exports = BlockConnector;