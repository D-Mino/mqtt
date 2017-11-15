'use strict';

const mongoose = require('mongoose');
const Devices = mongoose.model('Device');
// Create the chat configuration
module.exports = function (io, socket) {
  socket.join(socket.request.user._id);
  // Send a toggleDevice
  socket.on('toggleDevice', function (data) {
    socket.broadcast.to(socket.request.user._id).emit('toggleDevice', data);
  });
  socket.on('updateDevice', function (event) {
    socket.broadcast.to(socket.request.user._id).emit('updateDevice', event);
  });
  socket.on('getStatus', function (code) {
    Devices.findOne({ code: code })
      .then((device) => {
        if (device) {
          socket.emit('getStatus', {
            gateway: device.gateway.map(item => {
              return { order: item.order, status: item.status };
            })
          });
        } else {
          socket.emit('getStatus', { message: 'Code invalid' });
        }
      })
      .catch((err) => {
        socket.emit('getStatus', { message: err });
      });
  });
};
