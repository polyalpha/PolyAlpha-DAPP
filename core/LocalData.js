const Static = require("../utils/Static");
const Utils = require('../utils/Utils');

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

class LocalData {

    /**
     * Get a list of all eth addresses of those who have registered with PolyAlpha. To be shown in the "Discover-New Users" tab. This list excludes:
     * - Users you have sent bids to (Will appear in "Bid-Your Bids" tab)
     * - Users that you have connected (Will appear in the Chats tab)
     * - Users that have sent bids to you (Will appear in "Bids-Bid For You" tab)
     */
    static getNewUserAddresses() {
        if (this.hasLocalStorage()) {
            return this.getArrayItem(Static.KEY.USER_LIST);
        }
        return [];
    }

    /**
     * A list of eth addresses of those who have connected with you. To be shown in the Chats tab
     */
    static getConenctedAddresses() {
        if (this.hasLocalStorage()) {
            return this.getArrayItem(Static.KEY.ACCEPTED_BIDS);
        }
        return [];
    }

    /**
     * A list of eth addresses of those who you have sent bids to. To be shown in the "Bid-Your Bids" tab.
     */
    static getMyBidAddresses() {
        if (this.hasLocalStorage()) {
            return this.getArrayItem(Static.KEY.MY_BIDS);
        }
        return [];
    }

    /**
     * A list of eth addresses of those who have sent bids to. To be shown in the "Bid-Bids For You" tab.
     */
    static getBidAddresses() {
        if (this.hasLocalStorage()) {
            return this.getArrayItem(Static.KEY.BIDS);
        }
        return [];
    }

    /**
     * Get user details
     * @param {string} address The eth address of the user
     */
    static getUser(address) {
        let user = {};
        if (this.hasLocalStorage()) {
            user = this.getObjectItem(address);
        }
        user[Static.KEY.USER_ADDRESS] = address;
        return user;
    }

    static getUsers(addresses) {
        let result = [];
        for (var i=0;i<addresses.length;i++) {
            let user = LocalData.getUser(addresses[i]);
            result.push(user);
        }
        return result;
    }

    /// Add a new user who has registered with PolyAlpha to local storage
    static addUser(address, publicKeyLeft, publicKeyRight, username, name, avatarUrl, blockNumber) {
        address = address.toLowerCase();

        if (this.hasLocalStorage()) {
            
            if (address == this.getAddress()) return;

            let user = this.getObjectItem(address);
            user[Static.KEY.USER_UNAME] = username;
            user[Static.KEY.USER_NAME] = name;
            user[Static.KEY.USER_AVARTAR_URL] = avatarUrl;
            user[Static.KEY.USER_PUBKEY] = publicKeyLeft.substring(2) + publicKeyRight.substring(2);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.NOBID;
            user[Static.KEY.USER_BLOCKNUMBER] = blockNumber;

            this.setObjectItem(address, user);
            
            let userList = this.getArrayItem(Static.KEY.USER_LIST);
            userList.push(address);
            this.setObjectItem(Static.KEY.USER_LIST, userList);
        }
    }

    static updateUserProfile(address, username, name, avatarUrl, blockNumber) {
        address = address.toLowerCase();

        if (this.hasLocalStorage()) {
            let user = this.getObjectItem(address);
            user[Static.KEY.USER_UNAME] = username;
            user[Static.KEY.USER_NAME] = name;
            user[Static.KEY.USER_AVARTAR_URL] = avatarUrl;
            user[Static.KEY.USER_BLOCKNUMBER] = blockNumber;
            this.setObjectItem(address, user);
        }
    }

    static updateUserAvailability(address, available) {
        let user = this.getObjectItem(address);
        let users = this.getArrayItem(Static.KEY.USER_LIST);
        if (available) {
            if (user[Static.KEY.BID_STATUS] == Static.BidStatus.NOBID) {
                users.push(address);
            }
        } else {
            users.remove(address);
        }
        this.setObjectItem(Static.KEY.USER_LIST, users);
    }

    /// Cancel a bid that you have sent
    static cancelMyBid(toAddress) {
        toAddress = toAddress.toLowerCase();

        if (this.hasLocalStorage()) {
            let user = this.getObjectItem(toAddress);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.NOBID;
            this.setObjectItem(toAddress, user);

            let myBids = this.getArrayItem(Static.KEY.MY_BIDS);
            myBids.remove(toAddress);
            this.setObjectItem(Static.KEY.MY_BIDS, myBids);

            let users = this.getArrayItem(Static.KEY.USER_LIST);
            users.push(toAddress);
            this.setObjectItem(Static.KEY.USER_LIST, users);
        }
    }

    /// Your bid get blocked by the other side user.
    static myBidGetBlocked(toAddress) {
        toAddress = toAddress.toLowerCase();

        if (this.hasLocalStorage()) {
            let user = this.getObjectItem(toAddress);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.BLOCKED;
            this.setObjectItem(toAddress, user);
        }
    }

    /// A bid that you received get cancelled by the other side user
    static bidGetCancelled(address) {
        address = address.toLowerCase();

        if (this.hasLocalStorage()) {
            let bids = this.getArrayItem(Static.KEY.BIDS);
            bids.remove(address);
            this.setObjectItem(Static.KEY.BIDS, bids);

            let users = this.getArrayItem(Static.KEY.USER_LIST);
            users.push(address);
            this.setObjectItem(Static.KEY.USER_LIST, users);
        }
    }

    /// Block a bid that you received
    static blockBid(fromAddress) {
        fromAddress = fromAddress.toLowerCase();

        if (this.hasLocalStorage()) {
            let user = this.getObjectItem(fromAddress);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.BLOCKED;
            this.setObjectItem(fromAddress, user);
        }
    }

    static acceptBid(address, message, txHash, bidType, blockNumber) {
        address = address.toLowerCase();

        if (this.hasLocalStorage()) {
            let arrayKey = Static.KEY.BIDS;
            if (bidType == Static.BidType.TO) {
                arrayKey = Static.KEY.MY_BIDS;
            }

            let bids = this.getArrayItem(arrayKey);
            bids.remove(address);
            this.setObjectItem(arrayKey, bids);

            let accepteds = this.getArrayItem(Static.KEY.ACCEPTED_BIDS);
            accepteds.push(address);
            this.setObjectItem(Static.KEY.ACCEPTED_BIDS, accepteds);

            this.addMessage(address, message, txHash, Static.MsgStatus.SENT, 
                (bidType == Static.BidType.TO ? Static.MsgType.FROM : Static.MsgType.TO), blockNumber);
        }
    }

    static addBid(userAddress, message, tokenAmount, bidType, blockNumber) {
        userAddress = userAddress.toLowerCase();

        let arrayKey = Static.KEY.BIDS;
        if (bidType == Static.BidType.TO) {
            arrayKey = Static.KEY.MY_BIDS;
        }

        if (this.hasLocalStorage()) {
            let user = this.getObjectItem(userAddress);

            let addresses = this.getArrayItem(arrayKey);
            addresses.push(userAddress);
            this.setObjectItem(arrayKey, addresses);

            let users = this.getArrayItem(Static.KEY.USER_LIST);
            users.remove(userAddress);
            this.setObjectItem(Static.KEY.USER_LIST, users);

            user[Static.KEY.BID_TYPE] = bidType;
            user[Static.KEY.BID_STATUS] = Static.BidStatus.CREATED;
            user[Static.KEY.BID_AMOUNT] = tokenAmount;
            user[Static.KEY.USER_BLOCKNUMBER] = blockNumber;
            user[Static.KEY.BID_MESSAGE] = this.decryptMessage(userAddress, message);
            
            this.setObjectItem(userAddress, user);
        }
    }

    /**
     * Add message to localStorage. If a message with the same txHash exists, it will replace that message
     * @param {hex string} userAddress 
     * @param {hex string} message 
     * @param {hex string} txHash 
     * @param {string} status 
     * @param {string} type 
     * @param {number} blockNumber 
     */
    static addMessage(userAddress, message, txHash, status, type, blockNumber = 0) {
        userAddress = userAddress.toLowerCase();

        let user = this.getObjectItem(userAddress);
        if (user[Static.KEY.MESSAGES] == undefined) {
            user[Static.KEY.MESSAGES] = [];
        }

        let msg = {};
        msg[Static.KEY.MESSAGE_CONTENT] = this.decryptMessage(userAddress, message);
        msg[Static.KEY.MESSAGE_TYPE] = type;
        msg[Static.KEY.MESSAGE_TXHASH] = txHash;
        msg[Static.KEY.MESSAGE_STATUS] = status;
        msg[Static.KEY.MESSAGE_BLOCKNUMBER] = blockNumber;

        let msgArray = user[Static.KEY.MESSAGES];
        let updateMessage = false;
        for (var i=0; i<msgArray.length; i++) {
            if (msgArray[i][Static.KEY.MESSAGE_TXHASH] == txHash) {
                msgArray[i] = msg;
                updateMessage = true;
            }
        }

        if (updateMessage == false) {
            user[Static.KEY.MESSAGES].push(msg);
        }
        
        if (blockNumber != 0) {
            user[Static.KEY.USER_BLOCKNUMBER] = blockNumber;
        }
        this.setObjectItem(userAddress, user);
    }

    static setLastBlockNumber(value) {
        this.setItem(Static.KEY.LAST_BLOCK_NUMBER, value);
    }

    static getLastBlockNumber() {
        return this.getItem(Static.KEY.LAST_BLOCK_NUMBER);
    }

    static setLoggedIn(username, name, avatarUrl) {
        this.setItem(Static.KEY.UNAME, username);
        this.setItem(Static.KEY.NAME, name);
        this.setItem(Static.KEY.AVATAR_URL, avatarUrl);
        this.setItem(Static.KEY.LOGGED_IN, 'true');
    }

    static isLoggedIn() {
        return (this.getItem(Static.KEY.LOGGED_IN) == 'true');
    }

    /**
     * Set the account's private key to local storage
     * @param {string} value Private key in form of hex string
     */
    static setPrivateKey(value) {
        this.setItem(Static.KEY.PRIVATE_KEY, value);
        let valueBuffer = Buffer.from(value, 'hex');
        let address = Utils.privateToAddress(valueBuffer).toLowerCase();
        this.setItem(Static.KEY.ADDRESS, address);
    }

    static getPrivateKey() {
        return this.getItem(Static.KEY.PRIVATE_KEY);
    }

    static getAddress() {
        return this.getItem(Static.KEY.ADDRESS);
    }

    static getName() {
        return this.getItem(Static.KEY.NAME);
    }

    static getUsername() {
        return this.getItem(Static.KEY.UNAME);
    }

    static getAvatarUrl() {
        return this.getItem(Static.KEY.AVATAR_URL);
    }

    static getCurrentUser() {
        let user = {};
        user.name = this.getName();
        user.avatar = this.getAvatarUrl();
        return user;
    }

    static getBlockTime(blockNumber) {
        return Utils.parseIntSafe(this.getItem('blk_' + blockNumber));
    }

    static setBlockTime(blockNumber, time) {
        return this.setItem('blk_' + blockNumber, time);
    }

    
    // /// Test read and write speed in localStorage
    // static testSpeed() {
    //     console.log(Date.now());
    //     let count = 1000;
    //     /// Storing into localStorage is very slow
    //     for (var i=0;i<count;i++) {
    //         this.addUser('address' + i, 'publicKeyLeft' + i, 'publicKeyRight' + i,
    //             'name' + i, 'avatarUrl' + i);
    //     }
    //     console.log(Date.now());

    //     /// Reading from localStorage is very fast
    //     var result = "";
    //     for (var i=0;i<count;i++) {
    //         let user = this.getUser('address' + i);
    //         result += user[Static.KEY.USER_NAME] + "::";
    //         result += user[Static.KEY.USER_AVARTAR_URL] + "<br />";
    //     }
    //     console.log(Date.now());
    //     return result;
    // }


    /// PRIVATE METHODS

    static decryptMessage(address, onChainMessage) {
        let message = onChainMessage.substring(2);
        try {
            let user = this.getUser(address);
            let secret = Utils.computeSecret(Buffer.from(this.getPrivateKey(), 'hex'), 
                Buffer.from('04' + user[Static.KEY.USER_PUBKEY], 'hex'));
            return Utils.decrypt(message, secret);
        } catch (err) {
            // console.log(err);
            return Utils.hexToString(message);
        }
        
    }

    static setItem(key, value) {
        localStorage.setItem(key, value);
    }

    static setObjectItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key) {
        let result = localStorage.getItem(key);
        if (result == undefined) {
            result = "";
        }
        return result;
    }

    static getArrayItem(key) {
        let result = localStorage.getItem(key);
        if (result == undefined) {
            return [];
        } else {
            return JSON.parse(result);
        }
    }

    static getObjectItem(key) {
        let result = localStorage.getItem(key);
        if (result == undefined) {
            return {};
        } else {
            return JSON.parse(result);
        }
    }

    static hasLocalStorage() {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    static testArray() {
        let arr = [];
        arr.push('hello');
        arr.remove('hello');
        console.log(arr);
    }
}

module.exports = LocalData;