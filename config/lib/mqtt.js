var mosca = require('mosca'),
  config = require('../config'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


// here we start mosca

module.exports = function () {

  var pubsubsettings = {
    type: 'mongo',
    url: config.db.uri,
    pubsubCollection: 'mqtts',
    mongo: {}
  };

  var settings = {
    port: config.mqttPort,
    backend: pubsubsettings
  };
  var server = new mosca.Server(settings);
  server.on('ready', setup);

  // fired when the mqtt server is ready
  function setup() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
    console.log('server mqtt running: ', config.mqttPort);
  }

  function authenticate(client, username, password, callback) {
    User.findOne({
      $or: [{
        username: username.toLowerCase()
      }, {
        email: username.toLowerCase()
      }]
    }, function (err, user) {
      if (err) {
        return callback(null, false);
      }
      if (!user || !user.authenticate(password)) {
        return callback(null, false);
      }
      client.user = user.username;

      return callback(null, true);
    });
  }

  function authorizePublish(client, topic, payload, callback) {
    var auth = true;
    if (topic.split('/')[0] !== client.user) {
      auth = false;
    }

    callback(null, auth);
  }

  function authorizeSubscribe(client, topic, callback) {
    var auth = true;
    if (topic.split('/')[0] !== client.user) {
      auth = false;
    }

    callback(null, auth);
  }
  // fired whena  client is connected
  server.on('clientConnected', function (client) {
    let message = {
      topic: client.user + '/connect',
      payload: client.id, // or a Buffer
      qos: 0, // 0, 1, or 2
      retain: false // or true
    };
    server.publish(message, function () {
      console.log('client connected : ', client.id);
    });
  });

  // fired when a message is received
  server.on('published', function (packet, client) {

  });

  // fired when a client subscribes to a topic
  server.on('subscribed', function (topic, client) {

  });

  // fired when a client subscribes to a topic
  server.on('unsubscribed', function (topic, client) {

  });

  // fired when a client is disconnecting
  server.on('clientDisconnecting', function (client) {
    console.log('clientDisconnecting : ', client.id);
  });

  // fired when a client is disconnected
  server.on('clientDisconnected', function (client) {
    let message = {
      topic: client.user + '/disconnect',
      payload: client.id, // or a Buffer
      qos: 0, // 0, 1, or 2
      retain: false // or true
    };
    server.publish(message, function () {
      console.log('disconnected : ' + client.id);
    });
  });

  server.on('error', function (err) {
    console.log(err);
  });
};
