(function () {
  'use strict';

  angular
    .module('devices')
    .controller('DevicesListController', DevicesListController);

  DevicesListController.$inject = ['$scope', '$http', '$state', 'DevicesService', '$window', 'Notification', 'Socket', 'Authentication'];

  function DevicesListController($scope, $http, $state, DevicesService, $window, Notification, Socket, Authentication) {
    var vm = this;
    var message;

    vm.devices = DevicesService.query();
    vm.remove = remove;
    vm.toggle = toggle;
    init();

    // connect socket
    function init(token) {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }
      // Add an event listener to the 'toggleDevice' event
      Socket.on('toggleDevice', function (data) {
        vm.devices[data.index].gateway[data.order].status = !vm.devices[data.index].gateway[data.order].status;
        vm.devices[data.index].gateway[data.order].update = data.update;
        message = vm.devices[data.index].gateway[data.order].name + ' ' + vm.devices[data.index].name + data.update;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + message });
      });
      // Add an event listener to the 'updateDevice' event
      Socket.on('updateDevice', function (event) {
        vm.devices = DevicesService.query();
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Update device' });
      });
      Socket.on('connect_error', (error) => {
        console.log('connect', error);
      });
      Socket.on('connect', () => {
        console.log('connect ok');
      });
      Socket.on('error', (error) => {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Not connected socket!' });
      });
      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('toggleDevice');
        Socket.removeListener('updateDevice');
      });
    }

    function remove(index) {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.devices[index].$remove(function() {
          Socket.emit('updateDevice', {});
          vm.devices.splice(index, 1);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Device deleted successfully!' });
        });
      }
    }
    function toggle(device, order) {

      // Create a new device, or update the current instance
      var update = device.gateway[order].update;
      device.gateway[order].status = !device.gateway[order].status;
      device.gateway[order].update = (device.gateway[order].status ? ' On ' : ' Off ') + new Date().toLocaleTimeString();
      Socket.emit('toggleDevice', {
        index: vm.devices.indexOf(device),
        order: order,
        update: device.gateway[order].update
      });
      device.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        var message = device.gateway[order].name + ' ' + device.name + device.gateway[order].update;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>' + message });
      }

      function errorCallback(res) {
        device.gateway[order].status = !device.gateway[order].status;
        device.gateway[order].update = update;
        Socket.emit('toggleDevice', {
          index: vm.devices.indexOf(device),
          order: order,
          update: update
        });
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Device error!' });
      }
    }
  }
}());
