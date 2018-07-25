const compiledContract = require('../ethereum/build/PACore.json');
const compiledUserContract = require('../ethereum/build/PAUser.json');
const compiledBidContract = require('../ethereum/build/PAAttentionBidding.json');
const compiledMessagingContract = require('../ethereum/build/PAMessaging.json');
const LocalData = require('./LocalData');
const Utils = require('../utils/Utils');

class BlockchainReader {
    constructor(web3, contractAddress) {
        if (typeof window !== 'undefined') {
            this.web3 = web3;
            this.contractAddress = contractAddress;
            this.initialize();
        }
    }

    initialize = async() => {
        this.contract = await new this.web3.eth.Contract(JSON.parse(compiledContract.interface), 
            this.contractAddress);

        let userContractAddress = await this.contract.methods.userContract().call();
        let bidContractAddress = await this.contract.methods.bidContract().call();
        let messagingContractAddress = await this.contract.methods.messagingContract().call();

        this.userContract = await new this.web3.eth.Contract(JSON.parse(compiledUserContract.interface), 
            userContractAddress);
        this.bidContract = await new this.web3.eth.Contract(JSON.parse(compiledBidContract.interface), 
            bidContractAddress);
        this.messagingContract = await new this.web3.eth.Contract(JSON.parse(compiledMessagingContract.interface), 
            messagingContractAddress);

        this.myAddress = 

        this.runLoop();
    }

    runLoop = async() => {
        await this.readEvents();
        setTimeout(this.runLoop, 5000);
    }

    readEvents = async() => {
        let storedBlockNumber = Utils.parseIntSafe(LocalData.getLastBlockNumber());
        let currentBlockNumber = Utils.parseIntSafe(await this.web3.eth.getBlockNumber()) - 1;
        if (storedBlockNumber >= currentBlockNumber) return;

        let userEvents = this.userContract.getPastEvents('allEvents', {
            filter: {},
            fromBlock: storedBlockNumber,
            toBlock: currentBlockNumber
        });
        let bidEvents = this.bidContract.getPastEvents('allEvents', {
            filter: {},
            fromBlock: storedBlockNumber,
            toBlock: currentBlockNumber
        });
        let messageEvents = this.messagingContract.getPastEvents('allEvents', {
            filter: {},
            fromBlock: storedBlockNumber,
            toBlock: currentBlockNumber
        });

        for (var i=0;i<userEvents.length;i++) {
            let name = userEvents[i].event;
            let values = userEvents[i].returnValues;
            if (name == 'UserJoined') {
                LocalData.addUser(values.owner, values.publicKeyLeft, values.publicKeyRight,
                    values.name, values.avatarUrl);
            } else if (name == 'UserProfileUpdated') {
                LocalData.addUser(values.owner, values.name, values.avatarUrl);
            }
        }
        for (var i=0;i<bidEvents.length;i++) {
            let name = userEvents[i].event;
            let values = userEvents[i].returnValues;
            if (name == 'BidCreated') {
                // if (values.owner )
            }
        }
    }
}

module.exports = BlockchainReader;