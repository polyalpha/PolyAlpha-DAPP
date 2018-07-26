const LocalData = require('../core/LocalData');
const assert = require('assert');
const MockLocalStorage = require('../utils/MockLocalStorage');
const Static = require('../utils/Static');
const Utils = require('../utils/Utils');

global.window = {};
global.localStorage = new MockLocalStorage();

describe('Test local storage', function() {
    this.timeout(90000);

    beforeEach(() => {
        localStorage.clear();
    });

    it('test mock storage', () => {
        localStorage.setItem('hello', 'how are you?');
        assert.equal(localStorage.getItem('hello'), 'how are you?');
    })

    it('can add users', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }
        let users = LocalData.getNewUserAddresses();
        
        assert.equal(users.length, 10);
        for (var i=0;i<users.length;i++) {
            let address = users[i];
            assert.equal(address, 'address' + i);
            let user = LocalData.getObjectItem(address);
            assert.equal(user[Static.KEY.USER_UNAME], 'username' + i);
            assert.equal(user[Static.KEY.USER_NAME], 'name' + i);
            assert.equal(user[Static.KEY.USER_AVARTAR_URL], 'avatar' + i);
        }
    })

    it('can update user profile', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' + i, 'name' + i, 'avatar' + i);
        }
        LocalData.updateUserProfile('address2', 'username2 updated', 'name2 updated', 'avatar2 updated');
        let user = LocalData.getUser('address2');
        assert.equal(user[Static.KEY.USER_UNAME], 'username2 updated');
        assert.equal(user[Static.KEY.USER_NAME], 'name2 updated');
        assert.equal(user[Static.KEY.USER_AVARTAR_URL], 'avatar2 updated');
    })

    it('can update availability', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' + i, 'name' + i, 'avatar' + i);
        }
        LocalData.updateUserAvailability('address2', null);
        LocalData.updateUserAvailability('address3', false);

        let users = LocalData.getNewUserAddresses();
        assert.equal(users.length, 8);

        LocalData.updateUserAvailability('address2', true);
        users = LocalData.getNewUserAddresses();
        assert.equal(users.length, 9);
    })

    it('can add my bids', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }
        LocalData.addBid('address0', 1000, Static.BidType.TO);
        LocalData.addBid('address1', 1000, Static.BidType.TO);
        LocalData.addBid('address3', 1000, Static.BidType.TO);

        let users = LocalData.getNewUserAddresses();
        assert.equal(users.length, 7);
        assert.equal(users[0], 'address2');
        assert.equal(users[1], 'address4');

        let bids = LocalData.getMyBidAddresses();
        assert.equal(bids[2], 'address3');
    })

    it('can cancel my bids', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }
        LocalData.addBid('address0', 1000, Static.BidType.TO);
        LocalData.addBid('address1', 1000, Static.BidType.TO);
        LocalData.addBid('address3', 1000, Static.BidType.TO);
        LocalData.addBid('address4', 1000, Static.BidType.TO);

        LocalData.cancelMyBid('address1');
        LocalData.cancelMyBid('address3');

        let bids = LocalData.getMyBidAddresses();
        assert.equal(bids[1], 'address4');

        let users = LocalData.getNewUserAddresses();
        assert.equal(users.length, 8);
        assert.equal(users[0], 'address2');
        assert.equal(users[1], 'address5');
        assert.equal(users[7], 'address3');
    })

    it('my bids get blocked', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }
        LocalData.addBid('address0', 1000, Static.BidType.TO);
        LocalData.addBid('address1', 1000, Static.BidType.TO);
        LocalData.addBid('address3', 1000, Static.BidType.TO);

        LocalData.myBidGetBlocked('address1');

        let user = LocalData.getUser('address1');
        assert.equal(user[Static.KEY.BID_STATUS], Static.BidStatus.BLOCKED);

        let users = LocalData.getNewUserAddresses();
        assert.equal(users.length, 7);
        assert.equal(users[0], 'address2');

        let bids = LocalData.getMyBidAddresses();
        assert.equal(bids[2], 'address3');
    })

    it('can add bids from others', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }
        LocalData.addBid('address0', 1000, Static.BidType.TO);
        LocalData.addBid('address1', 1000, Static.BidType.FROM);
        LocalData.addBid('address3', 1000, Static.BidType.FROM);

        let users = LocalData.getNewUserAddresses();
        assert.equal(users.length, 7);
        assert.equal(users[0], 'address2');

        let bids = LocalData.getBidAddresses();
        assert.equal(bids[1], 'address3');
    })

    it('can block bids from others', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }
        LocalData.addBid('address0', 1000, Static.BidType.FROM);
        LocalData.addBid('address1', 1000, Static.BidType.FROM);
        LocalData.addBid('address3', 1000, Static.BidType.FROM);
        LocalData.blockBid('address1');

        let user = LocalData.getUser('address1');
        assert.equal(user[Static.KEY.BID_STATUS], Static.BidStatus.BLOCKED);

        let bids = LocalData.getBidAddresses();
        assert.equal(bids[2], 'address3');
    })

    it('bids get cancelled', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }
        LocalData.addBid('address0', 1000, Static.BidType.FROM);
        LocalData.addBid('address1', 1000, Static.BidType.FROM);
        LocalData.addBid('address3', 1000, Static.BidType.FROM);
        LocalData.bidGetCancelled('address0');
        LocalData.bidGetCancelled('address3');

        let users = LocalData.getNewUserAddresses();
        assert.equal(users.length, 9);
        assert.equal(users[8], 'address3');

        let bids = LocalData.getBidAddresses();
        assert.equal(bids[0], 'address1');
    })

    it('can accept bids', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }
        LocalData.addBid('address0', 1000, Static.BidType.FROM);
        LocalData.addBid('address1', 1000, Static.BidType.FROM);
        LocalData.addBid('address3', 1000, Static.BidType.FROM);
        LocalData.addBid('address5', 1000, Static.BidType.TO);
        LocalData.addBid('address6', 1000, Static.BidType.TO);

        LocalData.acceptBid('address0', Static.BidType.FROM);
        LocalData.acceptBid('address3', Static.BidType.FROM);
        LocalData.acceptBid('address5', Static.BidType.TO);

        let bids = LocalData.getBidAddresses();
        assert.equal(bids.length, 1);
        assert.equal(bids[0], 'address1');

        let myBids = LocalData.getMyBidAddresses();
        assert.equal(myBids.length, 1);
        assert.equal(myBids[0], 'address6');

        let connectedAddresses = LocalData.getConenctedAddresses();
        assert.equal(connectedAddresses.length, 3);
        assert.equal(connectedAddresses[2], 'address5');
    })

    it('can add messages', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'username' +i, 'name' + i, 'avatar' + i);
        }

        LocalData.addMessage('address2', Utils.makeid(20), Static.MsgType.TO);
        LocalData.addMessage('address2', Utils.makeid(20), Static.MsgType.TO);
        LocalData.addMessage('address2', Utils.makeid(20), Static.MsgType.FROM);
        LocalData.addMessage('address2', Utils.makeid(20), Static.MsgType.FROM);
        LocalData.addMessage('address2', Utils.makeid(20), Static.MsgType.FROM);
        LocalData.addMessage('address2', Utils.makeid(20), Static.MsgType.TO);

        LocalData.addMessage('address3', Utils.makeid(20), Static.MsgType.TO);
        LocalData.addMessage('address3', Utils.makeid(20), Static.MsgType.FROM);

        let user2 = LocalData.getUser('address2');
        let user3 = LocalData.getUser('address3');
        assert.equal(user2[Static.KEY.MESSAGES].length, 6);
        assert.equal(user3[Static.KEY.MESSAGES].length, 2);
    })







    // it('localStorage can stores 5000 users', () => {
    //     generateUserData(5000);
    //     let size = Utils.getObjectSize(localStorage.data);
    //     assert(size < 10000);
    //     console.log(size + ' KB');
    // })
    
    /// LocalStorage seems to be enough if the Dapp has less than about 5000 users (on Chrome).
    generateUserData = (numUser) => {
        for(var i=0;i<numUser;i++) {
            let address = Utils.makeid(40)
            LocalData.addUser(address, Utils.makeid(32), Utils.makeid(32), Utils.makeid(32), Utils.makeid(32));
            let user = LocalData.getObjectItem(address);
            user.messages = Utils.makeid(500);
            LocalData.setObjectItem(address, user);
        }
    }
});