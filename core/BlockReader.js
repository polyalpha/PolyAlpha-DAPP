const compiledContract = require('../ethereum/build/PACore.json');
const compiledTokenContract = require('../ethereum/build/PAToken.json');
const compiledUserContract = require('../ethereum/build/PAUser.json');
const compiledBidContract = require('../ethereum/build/PAAttentionBidding.json');
const compiledMessagingContract = require('../ethereum/build/PAMessaging.json');
const LocalData = require('./LocalData');
const Static = require('../utils/Static');
const Utils = require('../utils/Utils');
const {ENV} = require('../src/_configs/Config');

class BlockReader {
    constructor(web3, contractAddress, updateHandler, errorHandler) {
        this.web3 = web3;
        this.contractAddress = contractAddress;
        this.updateHandler = updateHandler;
        this.errorHandler = errorHandler;
        this.initialize();
    }

    async initialize() {
        try {
            this.contract = await new this.web3.eth.Contract(JSON.parse(compiledContract.interface), 
                this.contractAddress);

            // The reason these addresses are loaded from the core contract (instead of loading from Config) 
            // is because it make the code easier for running tests
            let userContractAddress = await this.contract.methods.userContract().call();
            let bidContractAddress = await this.contract.methods.bidContract().call();
            let messagingContractAddress = await this.contract.methods.messagingContract().call();

            this.userContract = await new this.web3.eth.Contract(JSON.parse(compiledUserContract.interface), 
                userContractAddress);
            this.bidContract = await new this.web3.eth.Contract(JSON.parse(compiledBidContract.interface), 
                bidContractAddress);
            this.messagingContract = await new this.web3.eth.Contract(JSON.parse(compiledMessagingContract.interface), 
                messagingContractAddress);

            // Token contract address currently not accessible from the smart contract, so, load it from Config instead
            this.tokenContract = await new this.web3.eth.Contract(JSON.parse(compiledTokenContract.interface), ENV.TokenContractAddress);
        } catch (err) {
            if (err && this.errorHandler) {
                this.errorHandler(err);
            }
        }

        this.isRunning = false;
        this.startRunLoop();

        this.startRunLoop = this.startRunLoop.bind(this);
        this.runLoop = this.runLoop.bind(this);
        this.updateEthBalance = this.updateEthBalance.bind(this);
        this.readEvents = this.readEvents.bind(this);
    }

    startRunLoop() {
        this.myAddress = LocalData.getAddress();
        this.myAddressTopic = this.myAddress.slice(0, 2) + '000000000000000000000000' + this.myAddress.slice(2, this.myAddress.length);

        if (this.myAddress != "" && this.isRunning == false && LocalData.isLoggedIn()) {
            this.isRunning = true;
            this.runLoop();
        }
    }

    async runLoop() {
        await this.readEvents();
        setTimeout(this.runLoop, 3000);
    }

    async updateEthBalance() {
        let balance = await this.web3.eth.getBalance(this.myAddress);
        let tokenBalance = await this.tokenContract.methods.balanceOf(this.myAddress).call();
        LocalData.setBalance(balance);
        LocalData.setTokenBalance(tokenBalance);
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
        console.log('readEvents');
        // only need to wait for transaction confirmations on main net.
        let confirmationWait = (ENV.EthNetworkId != 1) ? 0 : 1;

        let storedBlockNumber = Utils.parseIntSafe(LocalData.getLastBlockNumber());
        if (storedBlockNumber == 0) {
            storedBlockNumber = 2800664;
        }
        let currentBlockNumber = Utils.parseIntSafe(await this.web3.eth.getBlockNumber()) - confirmationWait;
        console.log(currentBlockNumber);

        if (storedBlockNumber < currentBlockNumber) {
            console.log('reading events from: ' + storedBlockNumber + ' to ' + currentBlockNumber);
            this.updateEthBalance();

            let userEvents = await this.userContract.getPastEvents('allEvents', {
                fromBlock: storedBlockNumber,
                toBlock: currentBlockNumber
            });

            let bidEvents = await this.bidContract.getPastEvents('allEvents', {
                fromBlock: storedBlockNumber,
                toBlock: currentBlockNumber
            });

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
                        Utils.hexToString(values.username), Utils.hexToString(values.name), Utils.hexToString(values.avatarUrl), 
                        userEvents[i].blockNumber);
                } else if (name == 'UserProfileUpdated') {
                    LocalData.updateUserProfile(values.sender, Utils.hexToString(values.username), 
                        Utils.hexToString(values.name), Utils.hexToString(values.avatarUrl), userEvents[i].blockNumber);
                } else if (name == 'UserAvailabilityUpdated') {
                    LocalData.updateUserAvailability(values.sender, values.availability);
                }
            }

            for (var i=0;i<bidEvents.length;i++) {
                let name = bidEvents[i].event;
                let txHash = bidEvents[i].transactionHash;
                let blockNumber = bidEvents[i].blockNumber;
                let values = bidEvents[i].returnValues;
                values.sender = values.sender.toLowerCase();
                values.receiver = values.receiver.toLowerCase();
                if (name == 'BidCreated') {
                    if (values.sender == this.myAddress) {
                        LocalData.addBid(values.receiver, values.message, values.tokenAmount, Static.BidType.TO, txHash, blockNumber);
                    } else if (values.receiver == this.myAddress) {
                        LocalData.addBid(values.sender, values.message, values.tokenAmount, Static.BidType.FROM, txHash, blockNumber);
                    }
                    LocalData.increaseBid(values.sender, values.receiver, values.tokenAmount);
                } else if (name == 'BidCancelled') {
                    if (values.sender == this.myAddress) {
                        LocalData.cancelMyBid(values.receiver);
                    } else if (values.receiver == this.myAddress) {
                        LocalData.bidGetCancelled(values.sender);
                    }
                    LocalData.decreaseBid(values.sender, values.receiver);
                } else if (name == 'BidAccepted') {
                    if (values.sender == this.myAddress) {
                        // If you are the one who accepted a bid, it mean the bid is FROM the other side user
                        LocalData.acceptBid(values.receiver, values.message, txHash, Static.BidType.FROM, blockNumber);
                    } else if (values.receiver == this.myAddress) {
                        LocalData.acceptBid(values.sender, values.message, txHash, Static.BidType.TO, blockNumber);
                    }
                } else if (name == 'BidBlocked') {
                    if (values.sender == this.myAddress) {
                        LocalData.blockBid(values.receiver);
                    } else if (values.receiver == this.myAddress) {
                        LocalData.myBidGetBlocked(values.sender);
                    }
                }
            }

            for (var i=0;i<messageEvents.length;i++) {
                let txHash = messageEvents[i].transactionHash;
                let blockNumber = messageEvents[i].blockNumber;
                let values = messageEvents[i].returnValues;
                values.sender = values.sender.toLowerCase();
                values.receiver = values.receiver.toLowerCase();
                if (values.sender == this.myAddress) {
                    LocalData.addMessage(values.receiver, values.message, txHash, Static.MsgStatus.SENT, Static.MsgType.TO, blockNumber);
                } else {
                    LocalData.addMessage(values.sender, values.message, txHash, Static.MsgStatus.SENT, Static.MsgType.FROM, blockNumber);
                }
            }

            if (this.updateHandler != undefined) {
                if (userEvents.length > 0 || bidEvents.length > 0 || messageEvents.length > 0) {
                    this.updateHandler();
                }
            }

            // Only if there is a valid account in localStorage, then the lastBlockNumber can be stored.
            if (LocalData.getAddress() != "") {
                LocalData.setLastBlockNumber(currentBlockNumber + 1); // Need to plus 1, otherwise it will read the currentblock again
            }
        }

        // console.log('read events done');
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