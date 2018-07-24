const LocalData = require('../core/LocalData');
const assert = require('assert');
const MockLocalStorage = require('../utils/MockLocalStorage');
const Static = require('../utils/Static');

GLOBAL.window = {};
GLOBAL.localStorage = new MockLocalStorage();

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
                'pubkeyright' + i, 'name' + i, 'avatar' + i);
        }
        let users = LocalData.getNewUsers();
        
        assert.equal(users.length, 10);
        for (var i=0;i<users.length;i++) {
            let address = users[i];
            assert.equal(address, 'address' + i);
            let user = LocalData.getObjectItem(address);
            assert.equal(user[Static.KEY.USER_NAME], 'name' + i);
            assert.equal(user[Static.KEY.USER_AVARTAR_URL], 'avatar' + i);
        }
    })

    it('can add bids', () => {
        for (var i=0;i<10;i++) {
            LocalData.addUser('address' + i, 'pubkeyleft' + i,
                'pubkeyright' + i, 'name' + i, 'avatar' + i);
        }
        LocalData.addBid('address0', 1000, Static.BidType.TO);
        LocalData.addBid('address1', 1000, Static.BidType.TO);
        LocalData.addBid('address3', 1000, Static.BidType.TO);

        let users = LocalData.getNewUsers();
        assert.equal(users.length, 7);
        assert.equal(users[0], 'address2');
        assert.equal(users[1], 'address4');
    })







    it('localStorage can stores 5000 users', () => {
        generateUserData(5000);
        let size = getStorageSize();
        assert(size < 10000);
        console.log(size + ' KB');
    })

    makeid = (len) => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < len; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }

    getStorageSize = () => {
        var obj = localStorage.data;
        var _lsTotal=0,_xLen,_x;
        for(_x in obj) {
            if (_x != 'length') {
                _xLen= ((obj[_x].length + _x.length)* 2);
                _lsTotal+=_xLen;
            }
        };
        return (_lsTotal / 1024).toFixed(2); /// in KB
    }
    
    /// LocalStorage seems to be enough if the Dapp has less than about 5000 users (on Chrome).
    generateUserData = (numUser) => {
        for(var i=0;i<numUser;i++) {
            let address = makeid(40)
            LocalData.addUser(address, makeid(32), makeid(32), makeid(32), makeid(32));
            let user = LocalData.getObjectItem(address);
            user.messages = makeid(500);
            LocalData.setObjectItem(address, user);
        }
    }
});