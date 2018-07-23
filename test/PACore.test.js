const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {testAccounts} = require('./testAccounts');
const Utils = require('../utils/Utils');
const Static = require('../utils/Static');
const BigNumber = require('big-number');

const web3 = new Web3(ganache.provider({accounts: testAccounts}));

let contract;
let tokenContract;
let userContract;
let messagingContract;
let bidContract;
let accounts;
let decimals = 100000000;
let defaultGas = 5000000;

describe('PolyAlpha core testing', function() {
    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();
    
        const compiledTokenContract = require('../ethereum/build/PAToken.json');
        tokenContract = await new web3.eth.Contract(JSON.parse(compiledTokenContract.interface))
            .deploy({data: compiledTokenContract.bytecode, arguments: [1000000000 * decimals, 'PolyAlpha Demo Token', 8, 'PATD']})
            .send({from: accounts[0], gas: defaultGas});
    
        const compiledUserContract = require('../ethereum/build/PAUser.json');
        userContract = await new web3.eth.Contract(JSON.parse(compiledUserContract.interface))
            .deploy({data: compiledUserContract.bytecode, arguments: []})
            .send({from: accounts[0], gas: defaultGas});
    
        const compiledBidContract = require('../ethereum/build/PAAttentionBidding.json');
        bidContract = await new web3.eth.Contract(JSON.parse(compiledBidContract.interface))
            .deploy({data: compiledBidContract.bytecode, arguments: [userContract.options.address, tokenContract.options.address]})
            .send({from: accounts[0], gas: defaultGas});
        
        const compiledMessagingContract = require('../ethereum/build/PAMessaging.json');
        messagingContract = await new web3.eth.Contract(JSON.parse(compiledMessagingContract.interface))
            .deploy({data: compiledMessagingContract.bytecode, arguments: [bidContract.options.address]})
            .send({from: accounts[0], gas: defaultGas});

        const compiledContract = require('../ethereum/build/PACore.json');
        contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
                        .deploy({
                            data: compiledContract.bytecode,
                            arguments: [
                                userContract.options.address,
                                bidContract.options.address,
                                messagingContract.options.address
                            ]
                        })
                        .send({from: accounts[0], gas: defaultGas});

        await tokenContract.methods.transferOwnership(bidContract.options.address)
            .send({from: accounts[0], gas: defaultGas});
        await userContract.methods.transferOwnership(contract.options.address)
            .send({from: accounts[0], gas: defaultGas});
        await bidContract.methods.transferOwnership(contract.options.address)
            .send({from: accounts[0], gas: defaultGas});
        await messagingContract.methods.transferOwnership(contract.options.address)
            .send({from: accounts[0], gas: defaultGas});

        await tokenContract.methods.transfer(accounts[1], 1000*decimals)
            .send({from: accounts[0], gas: defaultGas});
        await tokenContract.methods.transfer(accounts[2], 1000*decimals)
            .send({from: accounts[0], gas: defaultGas});
        await tokenContract.methods.transfer(accounts[3], 1000*decimals)
            .send({from: accounts[0], gas: defaultGas});
    });

    it('deploy contract', async () => {
        assert.ok(contract.options.address);
    });

    it('can register new account', async () => {
        let name = "Test 1";
        let avatarUrl = "https://testavatar/";
        await register(0, name, avatarUrl);
        let user = await getAccount(0);
        let isReg = await isRegistered(0);

        assert(isReg);
        assert.equal(name, Utils.hexToString(user[2]));
        assert.equal(avatarUrl, Utils.hexToString(user[3]));
    });

    it('cannot register twice', async() => {
        await register(0, "x", "x");
        await assertFailTransaction([0, "x", "x"], register);
    });

    it('can update profile', async() => {
        let name = "Updated test 1";
        let avatarUrl = "https://updatedavatar/";
        await register(0, "sample", "sample");
        await updateProfile(0, name, avatarUrl);

        let user = await getAccount(0);
        assert.equal(name, Utils.hexToString(user[2]));
        assert.equal(avatarUrl, Utils.hexToString(user[3]));
    })

    it('cannot update profile of unregistered user', async() => {
        await assertFailTransaction([0, "x", "x"], updateProfile);
    });

    it('can create bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        
        let bid = await getBid(0, 1);
        assert.equal(1000, bid[0]);
        assert.equal(Static.BidStatus.CREATED, bid[1]);
    })

    it('cannot create bid if not registered', async() => {
        await register(1, "sample", "sample");
        await assertFailTransaction([0, 1, 1000], createBid);
    })

    it('cannot create bid if other have not registered', async() => {
        await register(0, "sample", "sample");
        await assertFailTransaction([0, 1, 1000], createBid);
    })

    it('cannot create a bid twice', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await assertFailTransaction([0, 1, 1000], createBid);
    })

    it('cannot create bid if a bid has been sent from the other side', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await assertFailTransaction([1, 0, 1000], createBid);
    })

    it('can cancel bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await cancelBid(0, 1);

        let bid = await getBid(0, 1);
        assert.equal(0, bid[0]);
        assert.equal(Static.BidStatus.NOBID, bid[1]);
    })

    it('cannot accept a canncelled bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await cancelBid(0, 1);
        await assertFailTransaction([1, 0], acceptBid);
    })

    it('can create bid again after cancelled', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await cancelBid(0, 1);
        await createBid(0, 1, 10000);
        
        let bid = await getBid(0, 1);
        assert.equal(10000, bid[0]);
        assert.equal(Static.BidStatus.CREATED, bid[1]);
    })

    it('can accept bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await acceptBid(1, 0);

        let bid = await getBid(0, 1);
        assert.equal(Static.BidStatus.ACCEPTED, bid[1]);
    })

    it('cannot accept your own bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        assertFailTransaction([0,1], acceptBid);
    })

    it('cannot accept bid twice', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await acceptBid(1, 0);
        await assertFailTransaction([1, 0], acceptBid);
    });

    it('cannot accept a bid that is not exists', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await assertFailTransaction([1, 0], acceptBid);
    })

    it('can block bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await blockBid(1, 0);

        let bid = await getBid(0, 1);
        assert.equal(Static.BidStatus.BLOCKED, bid[1]);
    })

    it('cannot block bid twice', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await blockBid(1, 0);
        await assertFailTransaction([1, 0], blockBid);
    });

    it('cannot block a bid that is not exists', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await assertFailTransaction([1, 0], blockBid);
    })

    it('cannot cancel a blocked bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await blockBid(1, 0);
        await assertFailTransaction([0, 1], cancelBid);
    })

    it('cannot cancel an accepted bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await acceptBid(1, 0);
        await assertFailTransaction([0, 1], cancelBid);
    })

    it('can send message', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await acceptBid(1, 0);

        let msg = "how are you?"
        await sendMessage(0, 1, msg);
        let msgEvents = await messagingContract.getPastEvents('MessageSent', {
            filter: {}, fromBlock: 0
        });

        let msgOnChain = msgEvents[0]['returnValues'].message;
        assert.equal(msg, Utils.hexToString(msgOnChain));
    })

    it('cannot send message to an unregistered user', async() => {
        await register(0, "sample", "sample");
        await assertFailTransaction([0, 1, "how are you?"], sendMessage);
    })

    it('cannot send message if have not registered', async() => {
        await register(1, "sample", "sample");
        await assertFailTransaction([0, 1, "how are you?"], sendMessage);
    })

    it('cannot send message before bid get accepted', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);

        let msg = "how are you?";
        await assertFailTransaction([0, 1, msg], sendMessage);

        await acceptBid(1, 0);
        await sendMessage(0, 1, msg);
        assert(true);
    })

    it('cannot send message if bid get blocked', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await blockBid(1, 0);

        let msg = "how are you?";
        await assertFailTransaction([0, 1, msg], sendMessage);
    })

    it('has UserJoined events', async() => {
        await register(0, "user 1", "user 1 avatar");
        await register(1, "user 2", "user 2 avatar");

        let joinEvents = await userContract.getPastEvents('UserJoined', {filter: {}, fromBlock: 0});
        assert.equal(2, joinEvents.length);

        let event0 = joinEvents[0].returnValues;
        let event1 = joinEvents[1].returnValues;
        assert.equal("user 1", Utils.hexToString(event0.name));
        assert.equal("user 1 avatar", Utils.hexToString(event0.avatarUrl));
        assert.equal("user 2", Utils.hexToString(event1.name));
        assert.equal("user 2 avatar", Utils.hexToString(event1.avatarUrl));
    })

    it('has UserProfileUpdated events', async() => {
        await register(0, "user 1", "user 1 avatar");
        await register(1, "user 2", "user 2 avatar");
        await updateProfile(1, "updated user 2", "updated user 2 avatar");
        await updateProfile(0, "updated user 1", "updated user 1 avatar");
        let profileUpdateEvents = await userContract.getPastEvents('UserProfileUpdated', {filter: {}, fromBlock: 0});
        assert.equal(2, profileUpdateEvents.length);

        let event1 = profileUpdateEvents[0].returnValues;
        let event0 = profileUpdateEvents[1].returnValues;
        assert.equal("updated user 1", Utils.hexToString(event0.name));
        assert.equal("updated user 1 avatar", Utils.hexToString(event0.avatarUrl));
        assert.equal("updated user 2", Utils.hexToString(event1.name));
        assert.equal("updated user 2 avatar", Utils.hexToString(event1.avatarUrl));
    })

    it('has BidCreated event', async() => {
        await register(0, "user 1", "user 1 avatar");
        await register(1, "user 2", "user 2 avatar");
        await createBid(0,1,1000);

        let events = await bidContract.getPastEvents('BidCreated', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.tokenAmount, 1000);
        assert.equal(event0.toUser, accounts[1]);
        assert.equal(event0.owner, accounts[0]);
    })

    it('has BidCancelled event', async() => {
        await register(0, "user 1", "user 1 avatar");
        await register(1, "user 2", "user 2 avatar");
        await createBid(0,1,1000);
        await cancelBid(0,1);

        let events = await bidContract.getPastEvents('BidCancelled', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.toUser, accounts[1]);
        assert.equal(event0.owner, accounts[0]);
    })

    it('has BidAccepted event', async() => {
        await register(0, "user 1", "user 1 avatar");
        await register(1, "user 2", "user 2 avatar");
        await createBid(0, 1, 1000);
        await acceptBid(1, 0);

        let events = await bidContract.getPastEvents('BidAccepted', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.fromUser, accounts[0]);
        assert.equal(event0.owner, accounts[1]);
    })

    it('has BidBlocked event', async() => {
        await register(0, "user 1", "user 1 avatar");
        await register(1, "user 2", "user 2 avatar");
        await createBid(0, 1, 1000);
        await blockBid(1, 0);

        let events = await bidContract.getPastEvents('BidBlocked', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        assert.equal(event0.fromUser, accounts[0]);
        assert.equal(event0.owner, accounts[1]);
    })

    it('has MessageSent event', async() => {
        await register(0, "user 1", "user 1 avatar");
        await register(1, "user 2", "user 2 avatar");
        await createBid(0, 1, 1000);
        await acceptBid(1, 0);
        await sendMessage(0, 1, "hello 1");
        await sendMessage(1, 0, "hello 0");

        let events = await messagingContract.getPastEvents('MessageSent', {filter: {}, fromBlock: 0});
        let event0 = events[0].returnValues;
        let event1 = events[1].returnValues;

        assert.equal(event0.owner, accounts[0]);
        assert.equal(event0.toUser, accounts[1]);
        assert.equal(Utils.hexToString(event0.message), "hello 1");

        assert.equal(event1.owner, accounts[1]);
        assert.equal(event1.toUser, accounts[0]);
        assert.equal(Utils.hexToString(event1.message), "hello 0");
    })

    it('has correct token amount after accepting a bid', async() => {
        let initialBalance0 = BigNumber(await tokenContract.methods.balanceOf(accounts[0]).call());
        let initialBalance1 = BigNumber(await tokenContract.methods.balanceOf(accounts[1]).call());

        await register(0, "user 1", "user 1 avatar");
        await register(1, "user 2", "user 2 avatar");
        await createBid(0, 1, 1000);
        await acceptBid(1, 0);

        let balance0 = BigNumber(await tokenContract.methods.balanceOf(accounts[0]).call());
        let balance1 = BigNumber(await tokenContract.methods.balanceOf(accounts[1]).call());

        assert.equal(initialBalance0.subtract(balance0), 1000);
        assert.equal(balance1.subtract(initialBalance1), 1000);
    })


    ///--------------- Helper methods --------------------

    isRegistered = async(accountId) => {
        return await contract.methods.isRegistered(accounts[accountId]).call();
    }

    getAccount = async(accountId) => {
        return await contract.methods.getUser(accounts[accountId]).call();
    }
    
    register = async(accountId, name, avatarUrl) => {
        let publicKey = Utils.privateToPublic(testAccounts[accountId].secretKey);
        var publicKeyLeft = '0x' + publicKey.toString('hex', 0, 32);
        var publicKeyRight = '0x' + publicKey.toString('hex', 32, 64);

        await contract.methods.register(publicKeyLeft, publicKeyRight, 
            Utils.stringToHex(name), Utils.stringToHex(avatarUrl))
            .send({from: accounts[accountId], gas: defaultGas});
    }

    updateProfile = async(accountId, name, avatarUrl) => {
        await contract.methods.updateProfile(Utils.stringToHex(name), Utils.stringToHex(avatarUrl))
            .send({from: accounts[accountId], gas: defaultGas});
    }

    getBid = async(accountId, toId) => {
        return await contract.methods.getBid(accounts[accountId], accounts[toId]).call();
    }

    createBid = async(accountId, toId, tokenAmount) => {
        await contract.methods.createBid(accounts[toId], tokenAmount)
            .send({from: accounts[accountId], gas: defaultGas});
    }

    cancelBid = async(accountId, toId) => {
        await contract.methods.cancelBid(accounts[toId])
            .send({from: accounts[accountId], gas: defaultGas});
    }

    acceptBid = async(accountId, fromId) => {
        await contract.methods.acceptBid(accounts[fromId])
            .send({from: accounts[accountId], gas: defaultGas});
    }

    blockBid = async(accountId, fromId) => {
        await contract.methods.blockBid(accounts[fromId])
            .send({from: accounts[accountId], gas: defaultGas});
    }

    sendMessage = async(accountId, toId, message) => {
        await contract.methods.sendMessage(accounts[toId], Utils.stringToHex(message))
            .send({from: accounts[accountId], gas: defaultGas});
    }

    assertFailTransaction = async(params, method) => {
        var hasError = false;
        try {
            await method(...params);
        } catch (err) {
            hasError = true;
            console.log(err.message);
        }
        assert(hasError);
    }
});