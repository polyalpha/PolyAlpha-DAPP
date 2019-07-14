"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Static = require("../utils/Static");

var Utils = require('../utils/Utils');

var web3 = require('../ethereum/web3');

var BigNumber = require('big-number');

var Config = require('../src/_configs/Config');

Array.prototype.remove = function () {
  var what,
      a = arguments,
      L = a.length,
      ax;

  while (L && this.length) {
    what = a[--L];

    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }

  return this;
};

Array.prototype.pushWithoutDuplicate = function (object) {
  var index = this.indexOf(object);

  if (index == -1) {
    this.push(object);
  }
};

var LocalData =
/*#__PURE__*/
function () {
  function LocalData() {
    _classCallCheck(this, LocalData);
  }

  _createClass(LocalData, null, [{
    key: "getNewUserAddresses",

    /**
     * Get a list of all eth addresses of those who have registered with PolyAlpha. To be shown in the "Discover-New Users" tab. This list excludes:
     * - Users you have sent bids to (Will appear in "Bid-Your Bids" tab)
     * - Users that you have connected (Will appear in the Chats tab)
     * - Users that have sent bids to you (Will appear in "Bids-Bid For You" tab)
     */
    value: function getNewUserAddresses() {
      if (this.hasLocalStorage()) {
        return this.getArrayItem(Static.KEY.USER_LIST);
      }

      return [];
    }
    /**
     * A list of eth addresses of those who have connected with you. To be shown in the Chats tab
     */

  }, {
    key: "getConenctedAddresses",
    value: function getConenctedAddresses() {
      if (this.hasLocalStorage()) {
        return this.getArrayItem(Static.KEY.ACCEPTED_BIDS);
      }

      return [];
    }
    /**
     * A list of eth addresses of those who you have sent bids to. To be shown in the "Bid-Your Bids" tab.
     */

  }, {
    key: "getMyBidAddresses",
    value: function getMyBidAddresses() {
      if (this.hasLocalStorage()) {
        return this.getArrayItem(Static.KEY.MY_BIDS);
      }

      return [];
    }
    /**
     * A list of eth addresses of those who have sent bids to. To be shown in the "Bid-Bids For You" tab.
     */

  }, {
    key: "getBidAddresses",
    value: function getBidAddresses() {
      if (this.hasLocalStorage()) {
        return this.getArrayItem(Static.KEY.BIDS);
      }

      return [];
    }
    /**
     * Get user details
     * @param {string} address The eth address of the user
     */

  }, {
    key: "getUser",
    value: function getUser(address) {
      var user = {};

      if (this.hasLocalStorage()) {
        user = this.getObjectItem(address);
      }

      user[Static.KEY.USER_ADDRESS] = address;
      return user;
    }
  }, {
    key: "getUsers",
    value: function getUsers(addresses) {
      var result = [];

      for (var i = 0; i < addresses.length; i++) {
        var user = LocalData.getUser(addresses[i]);
        result.push(user);
      }

      return result;
    } /// Add a new user who has registered with PolyAlpha to local storage

  }, {
    key: "addUser",
    value: function addUser(address, publicKeyLeft, publicKeyRight, username, name, avatarUrl, blockNumber) {
      address = address.toLowerCase();

      if (this.hasLocalStorage()) {
        if (address == this.getAddress()) return;
        var user = this.getObjectItem(address);
        user[Static.KEY.USER_UNAME] = username;
        user[Static.KEY.USER_NAME] = name;
        user[Static.KEY.USER_AVARTAR_URL] = avatarUrl;
        user[Static.KEY.USER_PUBKEY] = publicKeyLeft.substring(2) + publicKeyRight.substring(2);
        user[Static.KEY.BID_STATUS] = Static.BidStatus.NOBID;
        user[Static.KEY.USER_BLOCKNUMBER] = blockNumber;
        this.setObjectItem(address, user);
        var userList = this.getArrayItem(Static.KEY.USER_LIST);
        userList.pushWithoutDuplicate(address);
        this.setObjectItem(Static.KEY.USER_LIST, userList);
      }
    }
  }, {
    key: "updateUserProfile",
    value: function updateUserProfile(address, username, name, avatarUrl, blockNumber) {
      address = address.toLowerCase();

      if (this.hasLocalStorage()) {
        var user = this.getObjectItem(address);
        user[Static.KEY.USER_UNAME] = username;
        user[Static.KEY.USER_NAME] = name;
        user[Static.KEY.USER_AVARTAR_URL] = avatarUrl;
        user[Static.KEY.USER_BLOCKNUMBER] = blockNumber;
        this.setObjectItem(address, user);
      }
    }
  }, {
    key: "updateUserAvailability",
    value: function updateUserAvailability(address, available) {
      address = address.toLowerCase();

      if (address == this.getAddress()) {
        this.setItem(Static.KEY.AVAILABLE, available);
      } else {
        var user = this.getObjectItem(address);
        var users = this.getArrayItem(Static.KEY.USER_LIST);

        if (available) {
          if (user[Static.KEY.BID_STATUS] == Static.BidStatus.NOBID) {
            users.pushWithoutDuplicate(address);
          }
        } else {
          users.remove(address);
        }

        this.setObjectItem(Static.KEY.USER_LIST, users);
      }
    } /// Cancel a bid that you have sent

  }, {
    key: "cancelMyBid",
    value: function cancelMyBid(toAddress) {
      toAddress = toAddress.toLowerCase();

      if (this.hasLocalStorage()) {
        var user = this.getObjectItem(toAddress);
        user[Static.KEY.BID_STATUS] = Static.BidStatus.NOBID;
        this.setObjectItem(toAddress, user);
        var myBids = this.getArrayItem(Static.KEY.MY_BIDS);
        myBids.remove(toAddress);
        this.setObjectItem(Static.KEY.MY_BIDS, myBids);
        var users = this.getArrayItem(Static.KEY.USER_LIST);
        users.pushWithoutDuplicate(toAddress);
        this.setObjectItem(Static.KEY.USER_LIST, users);
      }
    } /// Your bid get blocked by the other side user.

  }, {
    key: "myBidGetBlocked",
    value: function myBidGetBlocked(toAddress) {
      toAddress = toAddress.toLowerCase();

      if (this.hasLocalStorage()) {
        var user = this.getObjectItem(toAddress);
        user[Static.KEY.BID_STATUS] = Static.BidStatus.BLOCKED;
        this.setObjectItem(toAddress, user);
      }
    } /// A bid that you received get cancelled by the other side user

  }, {
    key: "bidGetCancelled",
    value: function bidGetCancelled(address) {
      address = address.toLowerCase();

      if (this.hasLocalStorage()) {
        var bids = this.getArrayItem(Static.KEY.BIDS);
        bids.remove(address);
        this.setObjectItem(Static.KEY.BIDS, bids);
        var users = this.getArrayItem(Static.KEY.USER_LIST);
        users.pushWithoutDuplicate(address);
        this.setObjectItem(Static.KEY.USER_LIST, users);
      }
    } /// Block a bid that you received

  }, {
    key: "blockBid",
    value: function blockBid(fromAddress) {
      fromAddress = fromAddress.toLowerCase();

      if (this.hasLocalStorage()) {
        var user = this.getObjectItem(fromAddress);
        user[Static.KEY.BID_STATUS] = Static.BidStatus.BLOCKED;
        this.setObjectItem(fromAddress, user);
      }
    }
  }, {
    key: "acceptBid",
    value: function acceptBid(address, message, txHash, bidType, blockNumber) {
      address = address.toLowerCase();

      if (this.hasLocalStorage()) {
        var arrayKey = Static.KEY.BIDS;

        if (bidType == Static.BidType.TO) {
          arrayKey = Static.KEY.MY_BIDS;
        }

        var bids = this.getArrayItem(arrayKey);
        bids.remove(address);
        this.setObjectItem(arrayKey, bids);
        var accepteds = this.getArrayItem(Static.KEY.ACCEPTED_BIDS);
        accepteds.pushWithoutDuplicate(address);
        this.setObjectItem(Static.KEY.ACCEPTED_BIDS, accepteds);
        this.addMessage(address, message, txHash, Static.MsgStatus.SENT, bidType == Static.BidType.TO ? Static.MsgType.FROM : Static.MsgType.TO, blockNumber);
      }
    }
  }, {
    key: "addBid",
    value: function addBid(userAddress, message, tokenAmount, bidType, bidTxHash, blockNumber) {
      userAddress = userAddress.toLowerCase();
      var arrayKey = Static.KEY.BIDS;

      if (bidType == Static.BidType.TO) {
        arrayKey = Static.KEY.MY_BIDS;
      }

      if (this.hasLocalStorage()) {
        var user = this.getObjectItem(userAddress);
        var addresses = this.getArrayItem(arrayKey);
        addresses.pushWithoutDuplicate(userAddress);
        this.setObjectItem(arrayKey, addresses);
        var users = this.getArrayItem(Static.KEY.USER_LIST);
        users.remove(userAddress);
        this.setObjectItem(Static.KEY.USER_LIST, users);
        user[Static.KEY.BID_TYPE] = bidType;
        user[Static.KEY.BID_STATUS] = Static.BidStatus.CREATED;
        user[Static.KEY.BID_AMOUNT] = tokenAmount;
        user[Static.KEY.BID_TXHASH] = bidTxHash;
        user[Static.KEY.USER_BLOCKNUMBER] = blockNumber;
        user[Static.KEY.BID_MESSAGE] = this.decryptMessage(userAddress, message);
        this.setObjectItem(userAddress, user);
      }
    }
  }, {
    key: "increaseBid",
    value: function increaseBid(fromAddress, toAddress, amount) {
      this.updateBid(toAddress, amount, 1);
      var bidKey = fromAddress.substring(2, 8) + toAddress.substring(2, 8);
      this.setItem(bidKey, amount);
    }
  }, {
    key: "decreaseBid",
    value: function decreaseBid(fromAddress, toAddress) {
      var bidKey = fromAddress.substring(2, 8) + toAddress.substring(2, 8);
      var amount = this.getItem(bidKey);
      this.updateBid(toAddress, amount, -1);
    }
  }, {
    key: "updateBid",
    value: function updateBid(userAddress, amount, countUpdate) {
      var user = this.getObjectItem(userAddress);
      var currentAmount = user[Static.KEY.USER_BIDS_AMOUNT];

      if (currentAmount == undefined) {
        currentAmount = new BigNumber('0');
      } else {
        currentAmount = new BigNumber(currentAmount);
      }

      user[Static.KEY.USER_BIDS_AMOUNT] = currentAmount.plus(amount).toString();
      var currentCount = user[Static.KEY.USER_NUM_BIDS];
      user[Static.KEY.USER_NUM_BIDS] = Utils.parseIntSafe(currentCount) + countUpdate;
      this.setObjectItem(userAddress, user);
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

  }, {
    key: "addMessage",
    value: function addMessage(userAddress, message, txHash, status, type) {
      var blockNumber = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      userAddress = userAddress.toLowerCase();
      var user = this.getObjectItem(userAddress);

      if (user[Static.KEY.MESSAGES] == undefined) {
        user[Static.KEY.MESSAGES] = [];
      }

      var msg = {};
      msg[Static.KEY.MESSAGE_CONTENT] = this.decryptMessage(userAddress, message);
      msg[Static.KEY.MESSAGE_TYPE] = type;
      msg[Static.KEY.MESSAGE_TXHASH] = txHash;
      msg[Static.KEY.MESSAGE_STATUS] = status;
      msg[Static.KEY.MESSAGE_BLOCKNUMBER] = blockNumber;
      var msgArray = user[Static.KEY.MESSAGES];
      var updateMessage = false;

      for (var i = 0; i < msgArray.length; i++) {
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
  }, {
    key: "setLastBlockNumber",
    value: function setLastBlockNumber(value) {
      this.setItem(Static.KEY.LAST_BLOCK_NUMBER, value);
    }
  }, {
    key: "getLastBlockNumber",
    value: function getLastBlockNumber() {
      return this.getItem(Static.KEY.LAST_BLOCK_NUMBER);
    }
  }, {
    key: "setLoggedIn",
    value: function setLoggedIn(username, name, avatarUrl) {
      this.setItem(Static.KEY.UNAME, username);
      this.setItem(Static.KEY.NAME, name);
      this.setItem(Static.KEY.AVATAR_URL, avatarUrl);
      this.setItem(Static.KEY.LOGGED_IN, 'true');
    }
  }, {
    key: "isLoggedIn",
    value: function isLoggedIn() {
      return this.getItem(Static.KEY.LOGGED_IN) == 'true';
    }
    /**
     * Set the account's private key to local storage
     * @param {string} value Private key in form of hex string
     */

  }, {
    key: "setPrivateKey",
    value: function setPrivateKey(value, isGenerated) {
      this.setItem(Static.KEY.PRIVATE_KEY, value);
      var valueBuffer = Buffer.from(value, 'hex');
      var address = Utils.privateToAddress(valueBuffer).toLowerCase();
      this.setItem(Static.KEY.ADDRESS, address);
      this.setItem(Static.KEY.IS_ACCOUNT_GENERATED, isGenerated.toString());
    }
  }, {
    key: "getPrivateKey",
    value: function getPrivateKey() {
      return this.getItem(Static.KEY.PRIVATE_KEY);
    }
  }, {
    key: "getAddress",
    value: function getAddress() {
      return this.getItem(Static.KEY.ADDRESS);
    }
  }, {
    key: "isAccountGenerated",
    value: function isAccountGenerated() {
      return this.getItem(Static.KEY.IS_ACCOUNT_GENERATED) == "true";
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.getItem(Static.KEY.NAME);
    }
  }, {
    key: "getUsername",
    value: function getUsername() {
      return this.getItem(Static.KEY.UNAME);
    }
  }, {
    key: "getAvatarUrl",
    value: function getAvatarUrl() {
      return this.getItem(Static.KEY.AVATAR_URL);
    }
  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      var user = {};
      user.name = this.getUsername();
      user.avatar = this.getAvatarUrl();
      return user;
    }
  }, {
    key: "getBlockTime",
    value: function getBlockTime(blockNumber) {
      return Utils.parseIntSafe(this.getItem('blk_' + blockNumber));
    }
  }, {
    key: "setBlockTime",
    value: function setBlockTime(blockNumber, time) {
      return this.setItem('blk_' + blockNumber, time);
    }
  }, {
    key: "setBalance",
    value: function setBalance(balance) {
      this.setItem(Static.KEY.BALANCE, balance);
    }
  }, {
    key: "getBalance",
    value: function getBalance() {
      var decimal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
      var value = this.getItem(Static.KEY.BALANCE);

      if (value == "") {
        value = "0";
      }

      return parseFloat(web3.utils.fromWei(value, 'ether').toString()).toFixed(decimal);
    }
  }, {
    key: "setTokenBalance",
    value: function setTokenBalance(balance) {
      this.setItem(Static.KEY.TOKEN_BALANCE, balance);
    }
  }, {
    key: "getTokenBalance",
    value: function getTokenBalance() {
      var valueString = this.getItem(Static.KEY.TOKEN_BALANCE);

      if (valueString == "") {
        valueString = "0";
      }

      var value = new BigNumber(valueString);
      value = value.div(Config.TOKEN_DECIMAL);
      return value.toString();
    }
  }, {
    key: "getAvailability",
    value: function getAvailability() {
      // default availability is true
      return this.getItem(Static.KEY.AVAILABLE) != 'false' && this.getItem(Static.KEY.AVAILABLE) != 'null';
    } // /// Test read and write speed in localStorage
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

  }, {
    key: "decryptMessage",
    value: function decryptMessage(address, onChainMessage) {
      var message = onChainMessage.substring(2);

      try {
        var user = this.getUser(address);
        var secret = Utils.computeSecret(Buffer.from(this.getPrivateKey(), 'hex'), Buffer.from('04' + user[Static.KEY.USER_PUBKEY], 'hex'));
        return Utils.decrypt(message, secret);
      } catch (err) {
        // console.log(err);
        return Utils.hexToString(message);
      }
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      localStorage.setItem(key, value);
    }
  }, {
    key: "setObjectItem",
    value: function setObjectItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      var result = localStorage.getItem(key);

      if (result == undefined) {
        result = "";
      }

      return result;
    }
  }, {
    key: "getArrayItem",
    value: function getArrayItem(key) {
      var result = localStorage.getItem(key);

      if (result == undefined) {
        return [];
      } else {
        return JSON.parse(result);
      }
    }
  }, {
    key: "getObjectItem",
    value: function getObjectItem(key) {
      var result = localStorage.getItem(key);

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
  }, {
    key: "hasLocalStorage",
    value: function hasLocalStorage() {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "testArray",
    value: function testArray() {
      var arr = [];
      arr.push('hello');
      arr.remove('hello');
      console.log(arr);
    }
  }]);

  return LocalData;
}();

module.exports = LocalData;