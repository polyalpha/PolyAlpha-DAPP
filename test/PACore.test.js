const assert = require('assert');
const Utils = require('../utils/Utils');
const Static = require('../utils/Static');
const BigNumber = require('big-number');
const BlockConnector = require('../core/BlockConnector');

const connector = new BlockConnector();

describe('PolyAlpha core contract testing', function() {
    this.timeout(90000);

    beforeEach(async () => {
        await connector.deploy();
    });

    it('deploy contract', async () => {
        assert.ok(connector.contract.options.address);
    });

    it('can register new account', async () => {
        await connector.register(0, 'testusername', 'test', 'https://avatarUrl');
        let user = await connector.getAccount(0);
        let isReg = await connector.isRegistered(0);
        let isUsernameAvailable = await connector.isUsernameAvailable('testusername');
        let isUserAvailable = await connector.isUserAvailable(0);

        console.log(isReg + '::' + isUserAvailable + "::" + isUsernameAvailable);

        assert(!isUsernameAvailable);
        assert(isUserAvailable);
        assert(isReg);
        assert.equal('testusername', Utils.hexToString(user[2]));
        assert.equal('test', Utils.hexToString(user[3]));
        assert.equal('https://avatarUrl', Utils.hexToString(user[4]));
    });

    it('cannot register a username that is already exists', async() => {
        await connector.register(0, 'testusername', 'test', 'https://avatarUrl');
        assert(await connector.isFailed([1, 'testusername', 'test', 'https://avatarUrl'], 
            connector.register.name));
    })

    it('cannot register twice', async() => {
        await connector.register(0, 'x', 'x', 'x');
        assert(await connector.isFailed([0, 'x', 'x', 'x'], connector.register.name));
    });

    it('can update profile', async() => {
        let username = "Updated username";
        let name = "Updated test";
        let avatarUrl = "https://updatedavatar/";
        await connector.register(0, "sample", "sample", "sample");
        await connector.updateProfile(0, username, name, avatarUrl);

        let user = await connector.getAccount(0);
        assert.equal(username, Utils.hexToString(user[2]));
        assert.equal(name, Utils.hexToString(user[3]));
        assert.equal(avatarUrl, Utils.hexToString(user[4]));

        assert.equal(await connector.isUsernameAvailable('sample'), true);
        assert.equal(await connector.isUsernameAvailable('UpdAtEd username'), false);
    })

    it ('can update availability', async() => {
        await connector.register(0, "sample", "sample", "sample");
        await connector.updateAvailability(0, false);

        let isAvailable = await connector.isUserAvailable(0);
        assert(!isAvailable);
    })

    it('cannot update profile of unregistered user', async() => {
        assert(await connector.isFailed([0, "x", "x", "x"], connector.updateProfile.name));
    });

    it('can create bid', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        
        let bid = await connector.getBid(0, 1);
        assert.equal(1000, bid[0]);
        assert.equal(Static.BidStatus.CREATED, bid[1]);
    })

    it('cannot create bid if not registered', async() => {
        await connector.register(1, "sample1", "sample", "sample");
        assert(await connector.isFailed([0, 1, 1000], connector.createBid.name));
    })

    it('cannot create bid to an unavailable user', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.updateAvailability(1, false);

        assert(await connector.isFailed([0, 1, 1000], connector.createBid.name));
    })

    it('can enable availability', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.updateAvailability(1, false);
        await connector.updateAvailability(1, true);
        await connector.createBid(0, 1, 1000);

        let bid = await connector.getBid(0, 1);
        assert.equal(1000, bid[0]);
        assert.equal(Static.BidStatus.CREATED, bid[1]);
    })

    it('cannot create bid if other have not registered', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        assert(await connector.isFailed([0, 1, 1000], connector.createBid.name));
    })

    it('cannot create a bid twice', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        assert(await connector.isFailed([0, 1, 1000], connector.createBid.name));
    })

    it('cannot create bid if a bid has been sent from the other side', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        assert(await connector.isFailed([1, 0, 1000], connector.createBid.name));
    })

    it('can cancel bid', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.cancelBid(0, 1);

        let bid = await connector.getBid(0, 1);
        assert.equal(0, bid[0]);
        assert.equal(Static.BidStatus.NOBID, bid[1]);
    })

    it('cannot accept a canncelled bid', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.cancelBid(0, 1);
        assert(await connector.isFailed([1, 0], connector.acceptBid.name));
    })

    it('can create bid again after cancelled', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.cancelBid(0, 1);
        await connector.createBid(0, 1, 10000);
        
        let bid = await connector.getBid(0, 1);
        assert.equal(10000, bid[0]);
        assert.equal(Static.BidStatus.CREATED, bid[1]);
    })

    it('can accept bid', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.acceptBid(1, 0);

        let bid = await connector.getBid(0, 1);
        assert.equal(Static.BidStatus.ACCEPTED, bid[1]);
    })

    it('cannot accept your own bid', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        assert(await connector.isFailed([0,1], connector.acceptBid.name));
    })

    it('cannot accept bid twice', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.acceptBid(1, 0);
        assert(await connector.isFailed([1, 0], connector.acceptBid.name));
    });

    it('cannot accept a bid that is not exists', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        assert(await connector.isFailed([1, 0], connector.acceptBid.name));
    })

    it('can block bid', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.blockBid(1, 0);

        let bid = await connector.getBid(0, 1);
        assert.equal(Static.BidStatus.BLOCKED, bid[1]);
    })

    it('cannot block bid twice', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.blockBid(1, 0);
        assert(await connector.isFailed([1, 0], connector.blockBid.name));
    });

    it('cannot block a bid that is not exists', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        assert(await connector.isFailed([1, 0], connector.blockBid.name));
    })

    it('cannot cancel a blocked bid', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.blockBid(1, 0);
        assert(await connector.isFailed([0, 1], connector.cancelBid.name));
    })

    it('cannot cancel an accepted bid', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.acceptBid(1, 0);
        assert(await connector.isFailed([0, 1], connector.cancelBid.name));
    })

    it('can send message', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.acceptBid(1, 0);

        let msg = "how are you?"
        await connector.sendMessage(0, 1, msg);
        let msgEvents = await connector.messagingContract.getPastEvents('MessageSent', {
            filter: {}, fromBlock: 0
        });

        let msgOnChain = msgEvents[0]['returnValues'].message;
        assert.equal(msg, Utils.hexToString(msgOnChain));
    })

    it('cannot send message to an unregistered user', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.isFailed([0, 1, "how are you?"], connector.sendMessage.name);
    })

    it('cannot send message if have not registered', async() => {
        await connector.register(1, "sample1", "sample", "sample");
        assert(await connector.isFailed([0, 1, "how are you?"], connector.sendMessage.name));
    })

    it('cannot send message before bid get accepted', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);

        let msg = "how are you?";
        assert(await connector.isFailed([0, 1, msg], connector.sendMessage.name));

        await connector.acceptBid(1, 0);
        await connector.sendMessage(0, 1, msg);
        assert(true);
    })

    it('cannot send message if bid get blocked', async() => {
        await connector.register(0, "sample0", "sample", "sample");
        await connector.register(1, "sample1", "sample", "sample");
        await connector.createBid(0, 1, 1000);
        await connector.blockBid(1, 0);

        let msg = "how are you?";
        assert(await connector.isFailed([0, 1, msg], connector.sendMessage.name));
    })

    it('has UserJoined events', async() => {
        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.register(1, "username2", "user 2", "user 2 avatar");

        let joinEvents = await connector.userContract.getPastEvents('UserJoined', {filter: {}, fromBlock: 0});
        assert.equal(2, joinEvents.length);

        let event0 = joinEvents[0].returnValues;
        let event1 = joinEvents[1].returnValues;
        assert.equal("username1", Utils.hexToString(event0.username));
        assert.equal("user 1", Utils.hexToString(event0.name));
        assert.equal("user 1 avatar", Utils.hexToString(event0.avatarUrl));
        assert.equal("username2", Utils.hexToString(event1.username));
        assert.equal("user 2", Utils.hexToString(event1.name));
        assert.equal("user 2 avatar", Utils.hexToString(event1.avatarUrl));
    })

    it('has UserProfileUpdated events', async() => {
        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.register(1, "username2", "user 2", "user 2 avatar");
        await connector.updateProfile(1, "updatedusername2", "updated user 2", "updated user 2 avatar");
        await connector.updateProfile(0, "updatedusername1", "updated user 1", "updated user 1 avatar");
        let profileUpdateEvents = await connector.userContract.getPastEvents('UserProfileUpdated', {filter: {}, fromBlock: 0});
        assert.equal(2, profileUpdateEvents.length);

        let event1 = profileUpdateEvents[0].returnValues;
        let event0 = profileUpdateEvents[1].returnValues;
        assert.equal("updatedusername1", Utils.hexToString(event0.username));
        assert.equal("updated user 1", Utils.hexToString(event0.name));
        assert.equal("updated user 1 avatar", Utils.hexToString(event0.avatarUrl));
        assert.equal("updatedusername2", Utils.hexToString(event1.username));
        assert.equal("updated user 2", Utils.hexToString(event1.name));
        assert.equal("updated user 2 avatar", Utils.hexToString(event1.avatarUrl));
    })

    it('has UserAvailabilityUpdated events', async() => {
        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.updateAvailability(0, false);
        await connector.updateAvailability(0, true);

        let events = await connector.userContract.getPastEvents('UserAvailabilityUpdated', {filter: {}, fromBlock: 0});
        assert.equal(2, events.length);
        assert(!events[0].returnValues.availability);
        assert(events[1].returnValues.availability);
    })

    it('has BidCreated event', async() => {
        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.register(1, "username2", "user 2", "user 2 avatar");
        await connector.createBid(0,1,1000);

        let events = await connector.bidContract.getPastEvents('BidCreated', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.tokenAmount, 1000);
        assert.equal(event0.toUser, connector.accounts[1]);
        assert.equal(event0.owner, connector.accounts[0]);
    })

    it('has BidCancelled event', async() => {
        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.register(1, "username2", "user 2", "user 2 avatar");
        await connector.createBid(0,1,1000);
        await connector.cancelBid(0,1);

        let events = await connector.bidContract.getPastEvents('BidCancelled', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.toUser, connector.accounts[1]);
        assert.equal(event0.owner, connector.accounts[0]);
    })

    it('has BidAccepted event', async() => {
        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.register(1, "username2", "user 2", "user 2 avatar");
        await connector.createBid(0, 1, 1000);
        await connector.acceptBid(1, 0);

        let events = await connector.bidContract.getPastEvents('BidAccepted', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.fromUser, connector.accounts[0]);
        assert.equal(event0.owner, connector.accounts[1]);
    })

    it('has BidBlocked event', async() => {
        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.register(1, "username2", "user 2", "user 2 avatar");
        await connector.createBid(0, 1, 1000);
        await connector.blockBid(1, 0);

        let events = await connector.bidContract.getPastEvents('BidBlocked', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.fromUser, connector.accounts[0]);
        assert.equal(event0.owner, connector.accounts[1]);
    })

    it('has MessageSent event', async() => {
        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.register(1, "username2", "user 2", "user 2 avatar");
        await connector.createBid(0, 1, 1000);
        await connector.acceptBid(1, 0);
        await connector.sendMessage(0, 1, "hello 1");
        await connector.sendMessage(1, 0, "hello 0");

        let events = await connector.messagingContract.getPastEvents('MessageSent', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        let event1 = events[1].returnValues;

        assert.equal(event0.owner, connector.accounts[0]);
        assert.equal(event0.toUser, connector.accounts[1]);
        assert.equal(Utils.hexToString(event0.message), "hello 1");

        assert.equal(event1.owner, connector.accounts[1]);
        assert.equal(event1.toUser, connector.accounts[0]);
        assert.equal(Utils.hexToString(event1.message), "hello 0");
    })

    it('has correct token amount after accepting a bid', async() => {
        let initialBalance0 = BigNumber(await connector.tokenContract.methods.balanceOf(connector.accounts[0]).call());
        let initialBalance1 = BigNumber(await connector.tokenContract.methods.balanceOf(connector.accounts[1]).call());

        await connector.register(0, "username1", "user 1", "user 1 avatar");
        await connector.register(1, "username2", "user 2", "user 2 avatar");
        await connector.createBid(0, 1, 1000);
        await connector.acceptBid(1, 0);

        let balance0 = BigNumber(await connector.tokenContract.methods.balanceOf(connector.accounts[0]).call());
        let balance1 = BigNumber(await connector.tokenContract.methods.balanceOf(connector.accounts[1]).call());

        assert.equal(initialBalance0.subtract(balance0), 1000);
        assert.equal(balance1.subtract(initialBalance1), 1000);
    })
});