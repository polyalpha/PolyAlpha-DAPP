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

        let userContractAddress = await this.contract.methods.userContract().call();
        let bidContractAddress = await this.contract.methods.bidContract().call();
        let messagingContractAddress = await this.contract.methods.messagingContract().call();

        this.userContract = await new this.web3.eth.Contract(JSON.parse(compiledUserContract.interface), 
            userContractAddress);
        this.bidContract = await new this.web3.eth.Contract(JSON.parse(compiledBidContract.interface), 
            bidContractAddress);
        this.messagingContract = await new this.web3.eth.Contract(JSON.parse(compiledMessagingContract.interface), 
            messagingContractAddress);

        this.myAddress = LocalData.getAddress();
        this.myAddressTopic = this.myAddress.slice(0, 2) + '000000000000000000000000' + this.myAddress.slice(2, this.myAddress.length);
        console.log('my address:' + this.myAddress);
    }

    async startRunLoop() {
        await this.readEvents();
        setTimeout(this.runLoop, 5000);
    }

    async getBlockTime(blockNumber) {
        var timestamp = LocalData.getBlockTime(blockNumber);
        if (timestamp == 0) {
            let blk = await this.web3.eth.getBlock(blockNumber);
            timestamp = Utils.parseIntSafe(blk.timestamp);
            LocalData.setBlockTime(blockNumber, timestamp);
        }
        return timestamp;
    }

    async readEvents() {
        let storedBlockNumber = Utils.parseIntSafe(LocalData.getLastBlockNumber());
        let currentBlockNumber = Utils.parseIntSafe(await this.web3.eth.getBlockNumber()) - 1;
        if (storedBlockNumber >= currentBlockNumber) return;

        let userEvents = await this.userContract.getPastEvents('allEvents', {
            filter: {},
            fromBlock: storedBlockNumber,
            toBlock: currentBlockNumber
        });
        let bidEvents_to = await this.bidContract.getPastEvents('allEvents', {
            // filter: {sender: this.myAddress},
            topics: [null, this.myAddressTopic],
            fromBlock: storedBlockNumber,
            toBlock: currentBlockNumber
        });
        let bidEvents_from = await this.bidContract.getPastEvents('allEvents', {
            // filter: {receiver: this.myAddress},
            topics: [null, null, this.myAddressTopic],
            fromBlock: storedBlockNumber,
            toBlock: currentBlockNumber
        });
        let bidEvents = this.mergeEvents(bidEvents_to, bidEvents_from);

        let messageEvents_to = await this.messagingContract.getPastEvents('MessageSent', {
            // filter: {sender: this.myAddress},
            topics: [null, this.myAddressTopic],
            fromBlock: storedBlockNumber,
            toBlock: currentBlockNumber
        });
        let messageEvents_from = await this.messagingContract.getPastEvents('MessageSent', {
            // filter: {receiver: this.myAddress},
            topics: [null, null, this.myAddressTopic],
            fromBlock: storedBlockNumber,
            toBlock: currentBlockNumber
        });

        // Messages need to be orderred by blockNumber
        let messageEvents = this.mergeEvents(messageEvents_to, messageEvents_from);

        for (var i=0;i<userEvents.length;i++) {
            let name = userEvents[i].event;
            let values = userEvents[i].returnValues;
            if (name == 'UserJoined') {
                LocalData.addUser(values.sender, values.publicKeyLeft, values.publicKeyRight,
                    values.name, values.avatarUrl);
            } else if (name == 'UserProfileUpdated') {
                LocalData.addUser(values.sender, values.name, values.avatarUrl);
            }
        }

        for (var i=0;i<bidEvents.length;i++) {
            let name = bidEvents[i].event;
            let values = bidEvents[i].returnValues;
            if (name == 'BidCreated') {
                if (values.sender == this.myAddress) {
                    LocalData.addBid(values.receiver, values.tokenAmount, Static.BidType.TO);
                } else {
                    LocalData.addBid(values.sender, values.tokenAmount, Static.BidType.FROM);
                }
            } else if (name == 'BidCancelled') {
                if (values.sender == this.myAddress) {
                    LocalData.cancelMyBid(values.receiver);
                } else {
                    LocalData.bidGetCancelled(values.sender);
                }
            } else if (name == 'BidAccepted') {
                if (values.sender == this.myAddress) {
                    LocalData.acceptBid(values.receiver, Static.BidType.TO);
                } else {
                    LocalData.acceptBid(values.sender, Static.BidType.FROM);
                }
            } else if (name == 'BidBlocked') {
                if (values.sender == this.myAddress) {
                    LocalData.blockBid(values.receiver);
                } else {
                    LocalData.myBidGetBlocked(values.sender);
                }
            }
        }

        for (var i=0;i<messageEvents.length;i++) {
            let values = messageEvents[i].returnValues;
            if (values.sender == this.myAddress) {
                LocalData.addMessage(values.receiver, values.message, Static.MsgType.TO);
            } else {
                LocalData.addMessage(values.sender, values.message, Static.MsgType.FROM);
            }
        }
    }

    /// Merge 2 list of events and order by blockNumber
    mergeEvents(to_list, from_list) {
        var result = [];
        var i=0;
        var j=0;
        while (i < to_list.length && j < from_list.length) {
            if (from_list[j].blockNumber < to_list[i].blockNumber) {
                result.push(from_list[j]);
                j++;
            } else {
                result.push(to_list[i]);
                i++;
            }
        }
        while (i < to_list.length) {
            result.push(to_list[i]);
            i++;
        }
        while (j < from_list.length) {
            result.push(from_list[j]);
            j++;
        }
        return result;
    }
}

module.exports = BlockReader;