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
    static addUser(address, name, avatarUrl) {
        if (this.hasLocalStorage()) {
            let user = {};
            user[Static.KEY.USER_ADDRESS] = address;
            user[Static.KEY.USER_NAME] = name;
            user[Static.KEY.USER_AVARTAR_URL] = avatarUrl;
            let users = window.localStorage.getItem(Static.KEY.USER_LIST);
            if (users == undefined) {
                users = [];
            }
            users.push(user);
            window.localStorage.setItem(Static.KEY.USER_LIST, users);
        }
    }

    /// Get a list of all users who has registered with PolyAlpha
    static getUsers() {
        let users;
        if (this.hasLocalStorage()) {
            users = window.localStorage.getItem(Static.KEY.USER_LIST);
            if (users == undefined) {
                users = [];
            }
        } else {
            users = [];
        }
        return users;
    }

    // static addMyBid(toAddress, tokenAmount) {
    //     if (this.hasLocalStorage()) {
    //         let user = window.localStorage.getItem(toAddress);
    //         if (user == undefined) {
    //             user = {};

    //             let myBidAddressArray = window.localStorage.getItem(Static.KEY.MY_BIDS);
    //             if (myBidAddressArray == undefined) {
    //                 myBidAddressArray = [];
    //             }
    //             myBidAddressArray.push(toAddress);
    //             window.localStorage.setItem(Static.KEY.MY_BIDS, myBidAddressArray);
    //         }
    //         user[Static.KEY.BID_TYPE] = Static.BidType.TO;
    //         user[Static.KEY.BID_STATUS] = Static.BidStatus.CREATED;
    //         user[Static.KEY.BID_AMOUNT] = tokenAmount;
            
    //         window.localStorage.setItem(toAddress, user);
    //     }
    // }

    /// Cancel a bid that you have sent
    static cancelMyBid(toAddress) {
        if (this.hasLocalStorage()) {
            let user = window.localStorage.getItem(toAddress);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.NOBID;
            window.localStorage.setItem(toAddress, user);
        }
    }

    /// Your bid get blocked by the other side user.
    static myBidBeBlocked(toAddress) {
        if (this.hasLocalStorage()) {
            let user = window.localStorage.getItem(toAddress);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.BLOCKED;
            window.localStorage.setItem(toAddress, user);
        }
    }

    /// A bid that you received get cancelled by the other side user
    static bidGetCancelled(fromAddress) {
        if (this.hasLocalStorage()) {
            window.localStorage.removeItem(fromAddress);
            let addresses = window.localStorage.getItem(Static.KEY.BIDS);
            addresses.remove(fromAddress);
            window.localStorage.setItem(Static.KEY.BIDS, addresses);
        }
    }

    /// Block a bid that you received
    static blockBid(fromAddress) {
        if (this.hasLocalStorage()) {
            let user = window.localStorage.getItem(fromAddress);
            user[Static.KEY.BID_STATUS] = Static.BidStatus.BLOCKED;
            window.localStorage.setItem(fromAddress, user);
        }
    }

    static addBid(userAddress, tokenAmount, bidType) {
        let arrayKey = Static.KEY.BIDS;
        if (bidType == Static.BidType.TO) {
            Static.KEY.MY_BIDS;
        }

        if (this.hasLocalStorage()) {
            let user = window.localStorage.getItem(userAddress);
            if (user == undefined) {
                user = {};

                let addresses = window.localStorage.getItem(arrayKey);
                if (addresses == undefined) {
                    addresses = [];
                }
                addresses.push(toAddress);
                window.localStorage.setItem(arrayKey, addresses);
            }
            user[Static.KEY.BID_TYPE] = bidType;
            user[Static.KEY.BID_STATUS] = Static.BidStatus.CREATED;
            user[Static.KEY.BID_AMOUNT] = tokenAmount;
            
            window.localStorage.setItem(userAddress, user);
        }
    }

    

    // Messages

    // Bid received array
    // Bid sent array

    // static setItem(name, value) {
    //     if (this.hasLocalStorage()) {
    //         window.localStorage.setItem(name, value);
    //     }
    // }

    // static getItem(name) {
    //     if (this.hasLocalStorage()) {
    //         let value = window.localStorage.getItem(name);
    //         if (value == undefined) {
    //             return "";
    //         } else {
    //             return value;
    //         }
    //     } else {
    //         return "";
    //     }
    // }

    // static setItem(key, value) {
    //     window.localStorage.setItem(key, JSON.stringify(value));
    // }

    // static getItem(key) {
    //     let r = window.localStorage.getItem(key);
    // }

    static hasLocalStorage() {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    static storageSize() {
        var _lsTotal=0,_xLen,_x;
        for(_x in localStorage) {
            if (_x != 'length') {
                _xLen= ((localStorage[_x].length + _x.length)* 2);
                _lsTotal+=_xLen;
                // console.log(_x.substr(0,50)+" = "+ (_xLen/1024).toFixed(2)+" KB")
            }
        };
        console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
    }

    static makeid(len) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < len; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }
    
    /// LocalStorage seems to be enough if the Dapp has less than about 5000 users (on Chrome).
    static tryMaxLocalStorage() {
        if (this.hasLocalStorage()) {
            window.localStorage.clear();
            for(var i=0;i<5000;i++) {
                let user = {};
                user.name = this.makeid(32);
                user.avatarUrl = this.makeid(32);
                user.messages = this.makeid(500);
                window.localStorage.setItem(this.makeid(40), JSON.stringify(user));
            }
        }
        console.log(window.localStorage);
        this.storageSize();
    }
}

module.exports = LocalData;