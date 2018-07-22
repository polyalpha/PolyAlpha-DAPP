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

exports.encrypt = (message, secret) => {
    var cipher = crypto.createCipher(algorithm, secret);
    var crypted = cipher.update(message,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
  
exports.decrypt = (encryptedMessage, secret) => {
    var decipher = crypto.createDecipher(algorithm,secret)
    var dec = decipher.update(encryptedMessage,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}