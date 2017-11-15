'use strict';

/**
 * Module dependencies
 */
var devicesPolicy = require('../policies/devices.server.policy'),
  devices = require('../controllers/devices.server.controller');

module.exports = function(app) {
  // devices collection routes
  app.route('/api/devices').all(devicesPolicy.isAllowed)
    .get(devices.list)
    .post(devices.create);

  // Single device routes
  app.route('/api/devices/:deviceId').all(devicesPolicy.isAllowed)
    .get(devices.read)
    .put(devices.update)
    .delete(devices.delete);

  // Finish by binding the device middleware
  app.param('deviceId', devices.deviceByID);
};
