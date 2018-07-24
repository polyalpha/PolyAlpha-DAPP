const LocalData = require('../core/LocalData');
const assert = require('assert');
const MockLocalStorage = require('../utils/MockLocalStorage');
const Static = require('../utils/Static');

GLOBAL.window = {};
GLOBAL.window.localStorage = new MockLocalStorage();

describe('Test local storage', function() {
    beforeEach(async () => {
    });

    it('test mock storage', async() => {
        window.localStorage.setItem('hello', 'how are you?');
        assert.equal(window.localStorage.getItem('hello'), 'how are you?');
    })

    it('can add users', async() => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address ' + i, 'name ' + i, 'avatar ' + i);
        }
        let users = LocalData.getUsers();
        
        assert.equal(users.length, 10);
        for (var i=0;i<users.length;i++) {
            let u = users[i];
            assert.equal(u[Static.LOCAL.USER_ADDRESS], 'address ' + i);
            assert.equal(u[Static.LOCAL.USER_NAME], 'name ' + i);
            assert.equal(u[Static.LOCAL.USER_AVARTAR_URL], 'avatar ' + i);
        }
    })
});