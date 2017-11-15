'use strict';

var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'jsh9dUG52s18';

exports.encode = function (text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

exports.decode = function (text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};
