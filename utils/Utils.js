"use strict";

var crypto = require('crypto');

var EthUtil = require('ethereumjs-util');

var algorithm = 'aes256';

module.exports.stringToHex = function (text) {
  return '0x' + Buffer.from(text, 'ascii').toString('hex');
};

module.exports.hexToString = function (hex) {
  hex = hex.substring(2);
  return Buffer.from(hex, 'hex').toString('ascii').replace(/\0/g, '');
};

module.exports.privateToPublic = function (privateKey) {
  var account = crypto.createECDH('secp256k1');
  account.setPrivateKey(privateKey);
  return account.getPublicKey().slice(1);
};

module.exports.privateToAddress = function (privateKey) {
  return '0x' + EthUtil.privateToAddress(privateKey).toString('hex');
};
/**
 * Compute a secret from user A's private key and user B's public key
 * @param {Buffer} privateKeyFromA Private key from user A
 * @param {Buffer} publicKeyFromB Public key from user B
 */


module.exports.computeSecret = function (privateKeyFromA, publicKeyFromB) {
  var A = crypto.createECDH('secp256k1');
  A.setPrivateKey(privateKeyFromA);
  return A.computeSecret(publicKeyFromB);
};

module.exports.encrypt = function (message, secret) {
  var cipher = crypto.createCipher(algorithm, secret);
  var crypted = cipher.update(message, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

module.exports.decrypt = function (encryptedMessage, secret) {
  var decipher = crypto.createDecipher(algorithm, secret);
  var dec = decipher.update(encryptedMessage, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

module.exports.parseIntSafe = function (value) {
  return parseInt(value) || 0;
};

module.exports.parseFloatSafe = function (value) {
  return parseFloat(value) || 0;
};

module.exports.getObjectSize = function () {
  var obj = localStorage.data;

  var _lsTotal = 0,
      _xLen,
      _x;

  for (_x in obj) {
    if (_x != 'length') {
      _xLen = (obj[_x].length + _x.length) * 2;
      _lsTotal += _xLen;
    }
  }

  ;
  return (_lsTotal / 1024).toFixed(2); /// in KB
};

module.exports.makeid = function (len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

module.exports.scrollToBottom = function (element, duration) {
  var start = element.scrollTop,
      change = element.scrollHeight - start,
      currentTime = 0,
      increment = 20; //t = current time
  //b = start value
  //c = change in value
  //d = duration

  var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  var animateScroll = function animateScroll() {
    currentTime += increment;
    var val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;

    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };

  animateScroll();
};