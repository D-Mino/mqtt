'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Device = mongoose.model('Device'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an device
 */
exports.create = function (req, res) {
  var device = new Device(req.body);
  device.user = req.user;

  device.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(device);
    }
  });
};

/**
 * Show the current device
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var device = req.device ? req.device.toJSON() : {};

  // Add a custom field to the device, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the device model.
  device.isCurrentUserOwner = !!(req.user && device.user && device.user._id.toString() === req.user._id.toString());

  res.json(device);
};

/**
 * Update an device
 */
exports.update = function (req, res) {
  var device = req.device;

  device.name = req.body.name;
  device.code = req.body.code;
  device.gateway = req.body.gateway;

  device.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(device);
    }
  });
};

/**
 * Delete an device
 */
exports.delete = function (req, res) {
  var device = req.device;

  device.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(device);
    }
  });
};

/**
 * List of Devices
 */
exports.list = function (req, res) {
  Device.find({ user: req.user._id }).sort('-created').populate('user', 'displayName').exec(function (err, devices) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(devices);
    }
  });
};

/**
 * Device middleware
 */
exports.deviceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Device is invalid'
    });
  }

  Device.findById(id).populate('user', 'displayName').exec(function (err, device) {
    if (err) {
      return next(err);
    } else if (!device) {
      return res.status(404).send({
        message: 'No device with that identifier has been found'
      });
    }
    req.device = device;
    next();
  });
};
