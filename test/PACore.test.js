const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {testAccounts} = require('./testAccounts');
const Utils = require('../utils/Utils');
const Static = require('../utils/Static');

const web3 = new Web3(ganache.provider({accounts: testAccounts}));

let contract;
let tokenContract;
let messagingContract;
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
        const userContract = await new web3.eth.Contract(JSON.parse(compiledUserContract.interface))
            .deploy({data: compiledUserContract.bytecode, arguments: []})
            .send({from: accounts[0], gas: defaultGas});
    
        const compiledBidContract = require('../ethereum/build/PAAttentionBidding.json');
        const bidContract = await new web3.eth.Contract(JSON.parse(compiledBidContract.interface))
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

    it('can cancel bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await cancelBid(0, 1);

        let bid = await getBid(0, 1);
        assert.equal(0, bid[0]);
        assert.equal(Static.BidStatus.NOBID, bid[1]);
    })

    it('can accept bid', async() => {
        await register(0, "sample", "sample");
        await register(1, "sample", "sample");
        await createBid(0, 1, 1000);
        await acceptBid(1, 0);

        let bid = await getBid(0, 1);
        assert.equal(Static.BidStatus.ACCEPTED, bid[1]);
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