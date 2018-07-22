const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
// const BigNumber = require('big-number');

const web3 = new Web3(ganache.provider());

let contract;
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
            .deploy({data: compiledBidContract.bytecode, arguments: [tokenContract.options.address, userContract.options.address]})
            .send({from: accounts[0], gas: defaultGas});
        
        const compiledMessagingContract = require('../ethereum/build/PAMessaging.json');
        const messagingContract = await new web3.eth.Contract(JSON.parse(compiledMessagingContract.interface))
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
});