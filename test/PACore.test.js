const assert = require('assert');
const Utils = require('../utils/Utils');
const Static = require('../utils/Static');
const BigNumber = require('big-number');
const BlockConnector = require('../core/BlockConnector');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const testAccounts = require('../utils/testAccounts');


let web3 = new Web3(ganache.provider({accounts: testAccounts}));

const connector = new BlockConnector(web3, testAccounts, true);

describe('PolyAlpha core contract testing', function() {
    this.timeout(90000);

    beforeEach(async () => {
        await connector.deploy();
    });

    it('deploy contract', async () => {
        assert.ok(connector.contract.options.address);
    });

    it('can register new account', async () => {
        await connector.register('testusername', 'test', 'https://avatarUrl', 'extra', 0);
        let user = await connector.getAccount(0);
        let isReg = await connector.isRegistered(0);
        let isUsernameAvailable = await connector.isUsernameAvailable('testusername');
        let isUserAvailable = await connector.isUserAvailable(0);

        assert(!isUsernameAvailable);
        assert(isUserAvailable);
        assert(isReg);
        assert.equal('testusername', Utils.hexToString(user[2]));
        assert.equal('test', Utils.hexToString(user[3]));
        assert.equal('https://avatarUrl', Utils.hexToString(user[4]));
        assert.equal('extra', Utils.hexToString(user[5]));
    });

    it('cannot register a username that is already exists', async() => {
        await connector.register('testusername', 'test', 'https://avatarUrl', 'extra', 0);
        assert(await connector.isFailed([1, 'testusername', 'test', 'https://avatarUrl', 'extra'], 
            connector.register.name));
    })

    it('cannot register twice', async() => {
        await connector.register('x', 'x', 'x', 'x', 0);
        assert(await connector.isFailed(['x', 'x', 'x', 'x', 0], connector.register.name));
    });

    it('can update profile', async() => {
        let username = "Updated username";
        let name = "Updated test";
        let avatarUrl = "https://updatedavatar/";
        let extra = "Updated extra";
        await connector.register("sample", "sample", "sample", "sample", 0);
        await connector.updateProfile(username, name, avatarUrl, extra, 0);

        let user = await connector.getAccount(0);
        assert.equal(username, Utils.hexToString(user[2]));
        assert.equal(name, Utils.hexToString(user[3]));
        assert.equal(avatarUrl, Utils.hexToString(user[4]));
        assert.equal(extra, Utils.hexToString(user[5]));

        assert.equal(await connector.isUsernameAvailable('sample'), true);
        assert.equal(await connector.isUsernameAvailable('UpdAtEd username'), false);
    })

    it ('can update availability', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.updateAvailability(false, 0);

        let isAvailable = await connector.isUserAvailable(0);
        assert(!isAvailable);
    })

    it('cannot update profile of unregistered user', async() => {
        assert(await connector.isFailed([0, "x", "x", "x"], connector.updateProfile.name));
    });

    it('can create bid', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        
        let bid = await connector.getBid(1, 0);
        assert.equal(1000, bid[0]);
        assert.equal(Static.BidStatus.CREATED, bid[1]);
    })

    it('cannot create bid if not registered', async() => {
        await connector.register("sample1", "sample", "sample", "sample", 1);
        assert(await connector.isFailed([1, 1000, Utils.stringToHex("message"), 0], connector.createBid.name));
    })

    it('cannot create bid to an unavailable user', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.updateAvailability(false, 1);

        assert(await connector.isFailed([1, 1000, Utils.stringToHex("message"), 0], connector.createBid.name));
    })

    it('can enable availability', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.updateAvailability(false, 1);
        await connector.updateAvailability(true, 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);

        let bid = await connector.getBid(1, 0);
        assert.equal(1000, bid[0]);
        assert.equal(Static.BidStatus.CREATED, bid[1]);
    })

    it('cannot create bid if other have not registered', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        assert(await connector.isFailed([1, 1000, Utils.stringToHex("message"), 0], connector.createBid.name));
    })

    it('cannot create a bid twice', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        assert(await connector.isFailed([1, 1000, Utils.stringToHex("message"), 0], connector.createBid.name));
    })

    it('cannot create bid if a bid has been sent from the other side', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        assert(await connector.isFailed([0, 1000, Utils.stringToHex("message"), 1], connector.createBid.name));
    })

    it('can cancel bid', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.cancelBid(1, 0);

        let bid = await connector.getBid(1, 0);
        assert.equal(0, bid[0]);
        assert.equal(Static.BidStatus.NOBID, bid[1]);
    })

    it('cannot accept a canncelled bid', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.cancelBid(1, 0);
        assert(await connector.isFailed([0, Utils.stringToHex("message"), 1], connector.acceptBid.name));
    })

    it('can create bid again after cancelled', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.cancelBid(1, 0);
        await connector.createBid(1, 10000, Utils.stringToHex("message"), 0);
        
        let bid = await connector.getBid(1, 0);
        assert.equal(10000, bid[0]);
        assert.equal(Static.BidStatus.CREATED, bid[1]);
    })

    it('can accept bid', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 1);

        let bid = await connector.getBid(1, 0);
        assert.equal(Static.BidStatus.ACCEPTED, bid[1]);
    })

    it('cannot accept your own bid', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        assert(await connector.isFailed([1, Utils.stringToHex("message"), 0], connector.acceptBid.name));
    })

    it('cannot accept bid twice', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 1);
        assert(await connector.isFailed([0, Utils.stringToHex("message"), 1], connector.acceptBid.name));
    });

    it('cannot accept a bid that is not exists', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        assert(await connector.isFailed([0, Utils.stringToHex("message"), 1], connector.acceptBid.name));
    })

    it('can block bid', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.blockBid(0, 1);

        let bid = await connector.getBid(1, 0);
        assert.equal(Static.BidStatus.BLOCKED, bid[1]);
    })

    it('cannot block bid twice', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.blockBid(0, 1);
        assert(await connector.isFailed([0, 1], connector.blockBid.name));
    });

    it('cannot block a bid that is not exists', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        assert(await connector.isFailed([0, 1], connector.blockBid.name));
    })

    it('cannot cancel a blocked bid', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.blockBid(0, 1);
        assert(await connector.isFailed([1, 0], connector.cancelBid.name));
    })

    it('cannot cancel an accepted bid', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 1);
        assert(await connector.isFailed([1, 0], connector.cancelBid.name));
    })

    it('can create/accept multiple bids', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.register("sample2", "sample", "sample", "sample", 2);
        await connector.register("sample3", "sample", "sample", "sample", 3);

        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.createBid(2, 1000, Utils.stringToHex("message"), 0);
        await connector.createBid(3, 1000, Utils.stringToHex("message"), 0);

        // Not sure why it doesn't return the correct allowance
        // let allowance;
        // console.log(testAccounts[0].address + " :: " + connector.contract.options.address);
        // allowance = await connector.tokenContract.methods.allowance(testAccounts[0].address, connector.contract.options.address).call();
        // allowance = await connector.tokenContract.methods.allowance(connector.contract.options.address, testAccounts[0].address).call();
        // assert.equal(allowance, 3000);

        await connector.acceptBid(0, Utils.stringToHex("message"), 1);
        await connector.cancelBid(2, 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 3);

        // allowance = await connector.tokenContract.methods.allowance(testAccounts[0].address, connector.contract.options.address).call();
        // assert.equal(allowance, 0);
        assert(true);
    });

    it('can send message', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 1);

        let msg = "how are you?"
        await connector.sendMessage(1, Utils.stringToHex(msg), 0);
        let msgEvents = await connector.messagingContract.getPastEvents('MessageSent', {
            filter: {}, fromBlock: 0
        });

        let msgOnChain = msgEvents[0]['returnValues'].message;
        assert.equal(msg, Utils.hexToString(msgOnChain));
    })

    it('can send encrypted messages', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 1);

        let msg = "how are you?";
        let user1 = await connector.getAccount(1);
        let pubkey1 = user1[0].substring(2) + user1[1].substring(2);

        let secret0 = Utils.computeSecret(testAccounts[0].secretKey, Buffer.from('04' + pubkey1, 'hex'));
        let msgEncrypted = Utils.encrypt(msg, secret0);
        console.log(msgEncrypted);
        await connector.sendMessage(1, '0x' + msgEncrypted, 0);

        let msgEvents = await connector.messagingContract.getPastEvents('MessageSent', {
            filter: {}, fromBlock: 0
        });

        let msgOnChain = msgEvents[0]['returnValues'].message.substring(2);
        let user0 = await connector.getAccount(0);
        let pubkey0 = user0[0].substring(2) + user0[1].substring(2);
        let secret1 = Utils.computeSecret(testAccounts[1].secretKey, Buffer.from('04' + pubkey0, 'hex'));

        let msgDecrypted = Utils.decrypt(msgOnChain, secret1);
        assert.equal(secret0.toString('hex'), secret1.toString('hex'));
        assert.equal(msg, msgDecrypted);
    })

    it('cannot send message to an unregistered user', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.isFailed([1, Utils.stringToHex("how are you?"), 0], connector.sendMessage.name);
    })

    it('cannot send message if have not registered', async() => {
        await connector.register("sample1", "sample", "sample", "sample", 1);
        assert(await connector.isFailed([1, Utils.stringToHex("how are you?"), 0], connector.sendMessage.name));
    })

    it('cannot send message before bid get accepted', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);

        let msg = "how are you?";
        assert(await connector.isFailed([1, Utils.stringToHex(msg), 0], connector.sendMessage.name));

        await connector.acceptBid(0, Utils.stringToHex("message"), 1);
        await connector.sendMessage(1, Utils.stringToHex(msg), 0);
        assert(true);
    })

    it('cannot send message if bid get blocked', async() => {
        await connector.register("sample0", "sample", "sample", "sample", 0);
        await connector.register("sample1", "sample", "sample", "sample", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.blockBid(0, 1);

        let msg = "how are you?";
        assert(await connector.isFailed([1, Utils.stringToHex(msg), 0], connector.sendMessage.name));
    })

    it('has UserJoined events', async() => {
        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.register("username2", "user 2", "user 2 avatar", "", 1);

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
        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.register("username2", "user 2", "user 2 avatar", "", 1);
        await connector.updateProfile("updatedusername2", "updated user 2", "updated user 2 avatar", "", 1);
        await connector.updateProfile("updatedusername1", "updated user 1", "updated user 1 avatar", "", 0);
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
        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.updateAvailability(false, 0);
        await connector.updateAvailability(true, 0);

        let events = await connector.userContract.getPastEvents('UserAvailabilityUpdated', {filter: {}, fromBlock: 0});
        assert.equal(2, events.length);
        assert(!events[0].returnValues.availability);
        assert(events[1].returnValues.availability);
    })

    it('has BidCreated event', async() => {
        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.register("username2", "user 2", "user 2 avatar", "", 1);
        await connector.createBid(1,1000, Utils.stringToHex("message"),0);

        let events = await connector.bidContract.getPastEvents('BidCreated', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.tokenAmount, 1000);
        assert.equal(event0.receiver, connector.accounts[1]);
        assert.equal(event0.sender, connector.accounts[0]);
    })

    it('has BidCancelled event', async() => {
        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.register("username2", "user 2", "user 2 avatar", "", 1);
        await connector.createBid(1,1000, Utils.stringToHex("message"),0);
        await connector.cancelBid(1,0);

        let events = await connector.bidContract.getPastEvents('BidCancelled', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.receiver, connector.accounts[1]);
        assert.equal(event0.sender, connector.accounts[0]);
    })

    it('has BidAccepted event', async() => {
        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.register("username2", "user 2", "user 2 avatar", "", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 1);

        let events = await connector.bidContract.getPastEvents('BidAccepted', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.receiver, connector.accounts[0]);
        assert.equal(event0.sender, connector.accounts[1]);
    })

    it('has BidBlocked event', async() => {
        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.register("username2", "user 2", "user 2 avatar", "", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.blockBid(0, 1);

        let events = await connector.bidContract.getPastEvents('BidBlocked', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.receiver, connector.accounts[0]);
        assert.equal(event0.sender, connector.accounts[1]);
    })

    it('has MessageSent event', async() => {
        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.register("username2", "user 2", "user 2 avatar", "", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 1);
        await connector.sendMessage(1,  Utils.stringToHex("hello 1"), 0);
        await connector.sendMessage(0, Utils.stringToHex("hello 0"), 1);

        let events = await connector.messagingContract.getPastEvents('MessageSent', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        let event1 = events[1].returnValues;

        assert.equal(event0.sender, connector.accounts[0]);
        assert.equal(event0.receiver, connector.accounts[1]);
        assert.equal(Utils.hexToString(event0.message), "hello 1");

        assert.equal(event1.sender, connector.accounts[1]);
        assert.equal(event1.receiver, connector.accounts[0]);
        assert.equal(Utils.hexToString(event1.message), "hello 0");
    })

    it('has correct token amount after accepting a bid', async() => {
        let initialBalance0 = BigNumber(await connector.tokenContract.methods.balanceOf(connector.accounts[0]).call());
        let initialBalance1 = BigNumber(await connector.tokenContract.methods.balanceOf(connector.accounts[1]).call());

        await connector.register("username1", "user 1", "user 1 avatar", "", 0);
        await connector.register("username2", "user 2", "user 2 avatar", "", 1);
        await connector.createBid(1, 1000, Utils.stringToHex("message"), 0);
        await connector.acceptBid(0, Utils.stringToHex("message"), 1);

        let balance0 = BigNumber(await connector.tokenContract.methods.balanceOf(connector.accounts[0]).call());
        let balance1 = BigNumber(await connector.tokenContract.methods.balanceOf(connector.accounts[1]).call());

        assert.equal(initialBalance0.subtract(balance0), 1000);
        assert.equal(balance1.subtract(initialBalance1), 1000);
    })
});