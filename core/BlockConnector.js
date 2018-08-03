const Utils = require('../utils/Utils');

class BlockConnector {
    constructor(web3, accountObjects) {
        this.web3 = web3;
        this.accountObjects = accountObjects;
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
    
    async register(username, name, avatarUrl, extra = "", fromAccountId = 0) {
        let publicKey = Utils.privateToPublic(this.accountObjects[fromAccountId].secretKey);
        var publicKeyLeft = '0x' + publicKey.toString('hex', 0, 32);
        var publicKeyRight = '0x' + publicKey.toString('hex', 32, 64);

        await this.contract.methods.register(publicKeyLeft, publicKeyRight, Utils.stringToHex(username), 
            Utils.stringToHex(name), Utils.stringToHex(avatarUrl), Utils.stringToHex(extra))
            .send({from: this.accounts[fromAccountId], gas: this.defaultGas});
    }

    async updateAvailability(availability, fromAccountId = 0) {
        await this.contract.methods.updateAvailability(availability)
            .send({from: this.accounts[fromAccountId], gas: this.defaultGas});
    }

    async updateProfile(username, name, avatarUrl, extra = "", fromAccountId = 0) {
        await this.contract.methods.updateProfile(Utils.stringToHex(username), Utils.stringToHex(name), 
            Utils.stringToHex(avatarUrl), Utils.stringToHex(extra))
            .send({from: this.accounts[fromAccountId], gas: this.defaultGas});
    }

    async getBid(toId, fromAccountId = 0) {
        return await this.contract.methods.getBid(this.accounts[fromAccountId], this.accounts[toId]).call();
    }

    async createBid(toId, tokenAmount, message = "", fromAccountId = 0) {
        await this.contract.methods.createBid(this.accounts[toId], tokenAmount, Utils.stringToHex(message))
            .send({from: this.accounts[fromAccountId], gas: this.defaultGas});
    }

    async cancelBid(toId, fromAccountId = 0) {
        await this.contract.methods.cancelBid(this.accounts[toId])
            .send({from: this.accounts[fromAccountId], gas: this.defaultGas});
    }

    async acceptBid(fromId, message = "", fromAccountId = 0) {
        await this.contract.methods.acceptBid(this.accounts[fromId], Utils.stringToHex(message))
            .send({from: this.accounts[fromAccountId], gas: this.defaultGas});
    }

    async blockBid(fromId, fromAccountId = 0) {
        await this.contract.methods.blockBid(this.accounts[fromId])
            .send({from: this.accounts[fromAccountId], gas: this.defaultGas});
    }

    async sendMessage(toId, message, fromAccountId = 0) {
        await this.contract.methods.sendMessage(this.accounts[toId], Utils.stringToHex(message))
            .send({from: this.accounts[fromAccountId], gas: this.defaultGas});
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