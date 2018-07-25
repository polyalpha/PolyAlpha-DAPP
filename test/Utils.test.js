const Utils = require('../utils/Utils');
const testAccounts = require('../utils/testAccounts');
const assert = require('assert');

describe('Utils tests', () => {
    it('test calculate address from private key', () => {
        let addr = Utils.privateToAddress(testAccounts[0].secretKey);
        assert.equal(addr, '0x1297F794032bD97a16474B202d0a69758f8bE707'.toLowerCase());
    })
})