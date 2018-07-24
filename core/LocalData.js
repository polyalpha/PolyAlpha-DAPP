const Static = require("../utils/Static");

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

    /// Add a new user who has registered with PolyAlpha to local storage
    static addUser(address, publicKeyLeft, publicKeyRight, name, avatarUrl) {
        if (this.hasLocalStorage()) {
            let user = this.getObjectItem(address);
            user[Static.KEY.USER_ADDRESS] = address;
            user[Static.KEY.USER_NAME] = name;
            user[Static.KEY.USER_AVARTAR_URL] = avatarUrl;
            user[Static.KEY.USER_PUBKEY_LEFT] = publicKeyLeft;
            user[Static.KEY.USER_PUBKEY_RIGHT] = publicKeyRight;

            this.setObjectItem(address, user);
            
            let userList = this.getArrayItem(Static.KEY.USER_LIST);
            userList.push(address);
            this.setObjectItem(Static.KEY.USER_LIST, userList);
        }
    }

    /// Get a list of all users who has registered with PolyAlpha
    static getNewUsers() {
        if (this.hasLocalStorage()) {
            return this.getArrayItem(Static.KEY.USER_LIST);
        }
        return [];
    }

    // static addMyBid(toAddress, tokenAmount) {
    //     if (this.hasLocalStorage()) {
    //         let user = localStorage.getItem(toAddress);
    //         if (user == undefined) {
    //             user = {};

    //             let myBidAddressArray = localStorage.getItem(Static.KEY.MY_BIDS);
    //             if (myBidAddressArray == undefined) {
    //                 myBidAddressArray = [];
    //             }
    //             myBidAddressArray.push(toAddress);
    //             localStorage.setItem(Static.KEY.MY_BIDS, myBidAddressArray);
    //         }
    //         user[Static.KEY.BID_TYPE] = Static.BidType.TO;
    //         user[Static.KEY.BID_STATUS] = Static.BidStatus.CREATED;
    //         user[Static.KEY.BID_AMOUNT] = tokenAmount;
            
    //         localStorage.setItem(toAddress, user);
    //     }
    // }

    /// Cancel a bid that you have sent
    static cancelMyBid(toAddress) {
        if (this.hasLocalStorage()) {
            let user = this.getItem(toAddress);
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
    static myBidBeBlocked(toAddress) {
        if (this.hasLocalStorage()) {
            let user = this.getObjectItem(toAddress);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.BLOCKED;
            this.setObjectItem(toAddress, user);
        }
    }

    /// A bid that you received get cancelled by the other side user
    static bidGetCancelled(fromAddress) {
        if (this.hasLocalStorage()) {
            let bids = this.getArrayItem(Static.KEY.BIDS);
            bids.remove(fromAddress);
            this.setObjectItem(Static.KEY.BIDS, bids);

            let users = this.getArrayItem(Static.KEY.USER_LIST);
            users.push(toAddress);
            this.setObjectItem(Static.KEY.USER_LIST, users);
        }
    }

    /// Block a bid that you received
    static blockBid(fromAddress) {
        if (this.hasLocalStorage()) {
            let user = this.getObjectItem(fromAddress);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.BLOCKED;
            this.setObjectItem(fromAddress, user);
        }
    }

    static addBid(userAddress, tokenAmount, bidType) {
        let arrayKey = Static.KEY.BIDS;
        if (bidType == Static.BidType.TO) {
            Static.KEY.MY_BIDS;
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
            
            this.setObjectItem(userAddress, user);
        }
    }

    

    // Messages

    // Bid received array
    // Bid sent array

    // static setItem(name, value) {
    //     if (this.hasLocalStorage()) {
    //         localStorage.setItem(name, value);
    //     }
    // }

    // static getItem(name) {
    //     if (this.hasLocalStorage()) {
    //         let value = localStorage.getItem(name);
    //         if (value == undefined) {
    //             return "";
    //         } else {
    //             return value;
    //         }
    //     } else {
    //         return "";
    //     }
    // }



    /// PRIVATE METHODS

    static setItem(key, value) {
        localStorage.setItem(key, value);
    }

    static setObjectItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key) {
        return localStorage.getItem(key);
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

    // static getStorageSize() {
    //     var _lsTotal=0,_xLen,_x;
    //     for(_x in localStorage) {
    //         if (_x != 'length') {
    //             _xLen= ((localStorage[_x].length + _x.length)* 2);
    //             _lsTotal+=_xLen;
    //             console.log(_x.substr(0,50)+" = "+ (_xLen/1024).toFixed(2)+" KB")
    //         }
    //     };
    //     console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
    //     return (_lsTotal / 1024).toFixed(2); /// in KB
    // }
}

module.exports = LocalData;