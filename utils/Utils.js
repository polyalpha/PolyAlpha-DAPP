var crypto = require('crypto');

var algorithm = 'aes256';

module.exports.stringToHex = (text) => {
    return '0x' + Buffer.from(text, 'ascii').toString('hex');
}

module.exports.hexToString = (hex) => {
    hex = hex.substring(2);
    return Buffer.from(hex, 'hex').toString('ascii').replace(/\0/g, '');
}

module.exports.privateToPublic = (privateKey) => {
    var account = crypto.createECDH('secp256k1');
    account.setPrivateKey(privateKey);
    return account.getPublicKey().slice(1);
}

module.exports.computeSecret = (privateKeyFromA, publicKeyFromB) => {
    var A = crypto.createECDH('secp256k1');
    A.setPrivateKey(privateKeyFromA);
    return A.computeSecret(publicKeyFromB);
}

module.exports.encrypt = (message, secret) => {
    var cipher = crypto.createCipher(algorithm, secret);
    var crypted = cipher.update(message,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
  
module.exports.decrypt = (encryptedMessage, secret) => {
    var decipher = crypto.createDecipher(algorithm,secret)
    var dec = decipher.update(encryptedMessage,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports.getObjectSize = () => {
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

module.exports.makeid = (len) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < len; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}