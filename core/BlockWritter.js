const compiledContract = require('../ethereum/build/PACore.json');
const compiledUserContract = require('../ethereum/build/PAUser.json');
const compiledBidContract = require('../ethereum/build/PAAttentionBidding.json');
const compiledMessagingContract = require('../ethereum/build/PAMessaging.json');
const LocalData = require('./LocalData');
const Static = require('../utils/Static');
const Utils = require('../utils/Utils');

class BlockReader {
    constructor(web3, contractAddress) {
        this.web3 = web3;
        this.contractAddress = contractAddress;
    }

    async initialize() {
        this.contract = await new this.web3.eth.Contract(JSON.parse(compiledContract.interface), 
            this.contractAddress);
    }

    async sendMessage() {
        
    }
}