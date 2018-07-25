const assert = require('assert');
const BlockReader = require('../core/BlockReader');
const MockLocalStorage = require('../utils/MockLocalStorage');
const BlockConnector = require('../core/BlockConnector');

global.window = {};
global.localStorage = new MockLocalStorage();

this.connector = new BlockConnector();

describe('BlockReader tests', async () => {
    beforeEach(async () => {
        await this.connector.deploy();
        this.reader = new BlockReader(this.connector.web3, 
            this.connector.contract.options.address);
        await this.reader.initialize();
        
    })

    it('can read the blockchain', () => {
        assert(true);
    })
})