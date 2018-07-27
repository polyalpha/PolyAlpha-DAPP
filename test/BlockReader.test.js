const assert = require('assert');
const BlockReader = require('../core/BlockReader');
const MockLocalStorage = require('../utils/MockLocalStorage');
const BlockConnector = require('../core/BlockConnector');
const LocalData = require('../core/LocalData');
const testAccounts = require('../utils/testAccounts');

global.window = {};
global.localStorage = new MockLocalStorage();

let connector = new BlockConnector();
let reader;

describe('BlockReader tests', async () => {
    beforeEach(async () => {
        await connector.deploy();
        reader = new BlockReader(connector.web3, 
            connector.contract.options.address);
        await reader.initialize();
        LocalData.setPrivateKey(testAccounts[0].secretKey);
    })

    it('can merge 2 list of events', () => {
        let to_list, from_list;

        to_list=[{blockNumber: 1}, {blockNumber: 2}, {blockNumber: 5}, {blockNumber: 10}, {blockNumber: 11}];
        from_list = [{blockNumber: 2}, {blockNumber: 6}, {blockNumber: 8}, 
            {blockNumber: 9}, {blockNumber: 20}, {blockNumber: 21}, {blockNumber: 22}];
        assertMerge(to_list, from_list);
        assertMerge(from_list, to_list);

        to_list=[{blockNumber: 1}, {blockNumber: 2}, {blockNumber: 5}, {blockNumber: 10}, {blockNumber: 11}];
        from_list = [];
        assertMerge(to_list, from_list);
        assertMerge(from_list, to_list);
    });



    it('can read the blockchain', async () => {
        await connector.register(0, "username0", "name", "avatar");
        await connector.register(1, "username1", "name", "avatar");
        await connector.register(2, "username2", "name", "avatar");
        await connector.register(3, "username3", "name", "avatar");

        // await connector.createBid(0, 1, 10000);
        // await connector.createBid(0, 2, 10000);
        // await connector.createBid(0, 3, 10000);
        // await connector.createBid(1, 2, 10000);

        // await connector.acceptBid(2, 0);
        // await connector.acceptBid(2, 1);

        // await connector.blockBid(3, 0);
        // await connector.cancelBid(0, 1);

        // await connector.sendMessage(0, 2, "test message 1");
        // await connector.sendMessage(0, 2, "test message 2");
        // await connector.sendMessage(2, 0, "test message 3");
        // await connector.sendMessage(2, 1, "test message 4");
        // await connector.sendMessage(2, 1, "test message 5");
        // await connector.sendMessage(2, 1, "test message 6"); // get ignored

        await reader.readEvents();

        console.log(localStorage.data);
        // let addrs = LocalData.getNewUserAddresses();
        // assert.equal(addrs.length, 2);
        // assert.equal(addrs[0], connector.accounts[1].toLowerCase());
        // assert.equal(addrs[1], connector.accounts[2].toLowerCase());
    })



    // it('test storing all events', async() => {

    // })


    function assertMerge(to_list, from_list) {
        let result = reader.mergeEvents(from_list, to_list);
        assert.equal(result.length, to_list.length + from_list.length);
        assertEventsHaveCorrectOrder(result);
    }

    function assertEventsHaveCorrectOrder(events) {
        for (var i=1;i<events.length;i++) {
            assert(events[i].blockNumber >= events[i-1].blockNumber);
        }
    }
})