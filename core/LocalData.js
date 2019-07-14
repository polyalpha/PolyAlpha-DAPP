const Static = require("../utils/Static");
const Utils = require('../utils/Utils');
const web3 = require('../ethereum/web3');
const BigNumber = require('big-number');
const Config = require('../src/_configs/Config');

Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.pushWithoutDuplicate = function(object) {
    const index = this.indexOf(object);
    if (index == -1) {
        this.push(object);
    }
}



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
        const result = [];
        for (let i=0;i";
    //     }
    //     console.log(Date.now());
    //     return result;
    // }


    /// PRIVATE METHODS

    static decryptMessage(address, onChainMessage) {
        const message = onChainMessage.substring(2);
        try {
            const user = this.getUser(address);
            const secret = Utils.computeSecret(Buffer.from(this.getPrivateKey(), 'hex'), 
                Buffer.from(`04${user[Static.KEY.USER_PUBKEY]}`, 'hex'));
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
        const result = localStorage.getItem(key);
        if (result == undefined) {
            return [];
        } else {
            return JSON.parse(result);
        }
    }

    static getObjectItem(key) {
        const result = localStorage.getItem(key);
        if (result == undefined) {
            return {};
        } else {
            try {
                return JSON.parse(result);
            } catch (err) {
                if (err) {
                    console.log(err.message);
                    console.log(result);
                }
            }
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
        const arr = [];
        arr.push('hello');
        arr.remove('hello');
        console.log(arr);
    }
}

module.exports = LocalData;