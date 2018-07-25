const ganache = require('ganache-cli');
const Web3 = require('web3');
const testAccounts = require('../utils/testAccounts');
const Utils = require('../utils/Utils');

class BlockConnector {
    constructor() {
        this.web3 = new Web3(ganache.provider({accounts: testAccounts}));
        this.contract;
        this.tokenContract;
        this.userContract;
        this.messagingContract;
        this.bidContract;
        this.accounts;
        this.decimals = 100000000;
        this.defaultGas = 5000000;
    }

    async deploy() {
        this.accounts = await this.web3.eth.getAccounts();
    
        const compiledTokenContract = require('../ethereum/build/PAToken.json');
        this.tokenContract = await new this.web3.eth.Contract(JSON.parse(compiledTokenContract.interface))
            .deploy({data: compiledTokenContract.bytecode, arguments: [1000000000 * this.decimals, 'PolyAlpha Demo Token', 8, 'PATD']})
            .send({from: this.accounts[0], gas: this.defaultGas});
    
        const compiledUserContract = require('../ethereum/build/PAUser.json');
        this.userContract = await new this.web3.eth.Contract(JSON.parse(compiledUserContract.interface))
            .deploy({data: compiledUserContract.bytecode, arguments: []})
            .send({from: this.accounts[0], gas: this.defaultGas});
    
        const compiledBidContract = require('../ethereum/build/PAAttentionBidding.json');
        this.bidContract = await new this.web3.eth.Contract(JSON.parse(compiledBidContract.interface))
            .deploy({data: compiledBidContract.bytecode, arguments: [this.userContract.options.address, this.tokenContract.options.address]})
            .send({from: this.accounts[0], gas: this.defaultGas});
        
        const compiledMessagingContract = require('../ethereum/build/PAMessaging.json');
        this.messagingContract = await new this.web3.eth.Contract(JSON.parse(compiledMessagingContract.interface))
            .deploy({data: compiledMessagingContract.bytecode, arguments: [this.bidContract.options.address]})
            .send({from: this.accounts[0], gas: this.defaultGas});

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

        await this.tokenContract.methods.transferOwnership(this.bidContract.options.address)
            .send({from: this.accounts[0], gas: this.defaultGas});
        await this.userContract.methods.transferOwnership(this.contract.options.address)
            .send({from: this.accounts[0], gas: this.defaultGas});
        await this.bidContract.methods.transferOwnership(this.contract.options.address)
            .send({from: this.accounts[0], gas: this.defaultGas});
        await this.messagingContract.methods.transferOwnership(this.contract.options.address)
            .send({from: this.accounts[0], gas: this.defaultGas});

        await this.tokenContract.methods.transfer(this.accounts[1], 1000*this.decimals)
            .send({from: this.accounts[0], gas: this.defaultGas});
        await this.tokenContract.methods.transfer(this.accounts[2], 1000*this.decimals)
            .send({from: this.accounts[0], gas: this.defaultGas});
        await this.tokenContract.methods.transfer(this.accounts[3], 1000*this.decimals)
            .send({from: this.accounts[0], gas: this.defaultGas});
    }

    async isRegistered(accountId) {
        return await this.contract.methods.isRegistered(this.accounts[accountId]).call();
    }

    async getAccount(accountId) {
        return await this.contract.methods.getUser(this.accounts[accountId]).call();
    }
    
    async register(accountId, name, avatarUrl) {
        let publicKey = Utils.privateToPublic(testAccounts[accountId].secretKey);
        var publicKeyLeft = '0x' + publicKey.toString('hex', 0, 32);
        var publicKeyRight = '0x' + publicKey.toString('hex', 32, 64);

        await this.contract.methods.register(publicKeyLeft, publicKeyRight, 
            Utils.stringToHex(name), Utils.stringToHex(avatarUrl))
            .send({from: this.accounts[accountId], gas: this.defaultGas});
    }

    async updateProfile(accountId, name, avatarUrl) {
        await this.contract.methods.updateProfile(Utils.stringToHex(name), Utils.stringToHex(avatarUrl))
            .send({from: this.accounts[accountId], gas: this.defaultGas});
    }

    async getBid(accountId, toId) {
        return await this.contract.methods.getBid(this.accounts[accountId], this.accounts[toId]).call();
    }

    async createBid(accountId, toId, tokenAmount) {
        await this.contract.methods.createBid(this.accounts[toId], tokenAmount)
            .send({from: this.accounts[accountId], gas: this.defaultGas});
    }

    async cancelBid(accountId, toId) {
        await this.contract.methods.cancelBid(this.accounts[toId])
            .send({from: this.accounts[accountId], gas: this.defaultGas});
    }

    async acceptBid(accountId, fromId) {
        await this.contract.methods.acceptBid(this.accounts[fromId])
            .send({from: this.accounts[accountId], gas: this.defaultGas});
    }

    async blockBid(accountId, fromId) {
        await this.contract.methods.blockBid(this.accounts[fromId])
            .send({from: this.accounts[accountId], gas: this.defaultGas});
    }

    async sendMessage(accountId, toId, message) {
        await this.contract.methods.sendMessage(this.accounts[toId], Utils.stringToHex(message))
            .send({from: this.accounts[accountId], gas: this.defaultGas});
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