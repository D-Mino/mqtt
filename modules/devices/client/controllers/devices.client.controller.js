(function () {
  'use strict';

  angular
    .module('devices')
    .controller('DevicesController', DevicesController);

  DevicesController.$inject = ['$scope', '$state', '$window', 'deviceResolve', 'Authentication', 'Notification', 'Socket'];

  function DevicesController($scope, $state, $window, device, Authentication, Notification, Socket) {
    var vm = this;

    if (device.gateway) {
      vm.count = device.gateway.length.toString();
      vm.gateway = device.gateway;
    } else {
      vm.count = '4';
      vm.gateway = [];
      for (var i = 0; i < vm.count; i++) {
        vm.gateway.push({
          name: '',
          status: false,
          update: new Date().toLocaleTimeString(),
          order: i
        });
      }
    }
    vm.device = device;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.onchange = function () {
      if (vm.count < vm.gateway.length) {
        vm.gateway = vm.gateway.slice(0, vm.count);
      } else {
        if (device.gateway && vm.count === device.gateway.length) {
          vm.gateway = device.gateway;
        } else {
          for (var i = vm.gateway.length; i < vm.count; i++) {
            vm.gateway.push({
              name: '',
              status: false,
              update: new Date().toLocaleTimeString(),
              order: i
            });
          }
        }
      }
    };
    // Remove existing Device
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.device.$remove(function() {
          Socket.emit('updateDevice', {});
          $state.go('devices.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Device deleted successfully!' });
        });
      }
    }

    // Save Device
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.deviceForm');
        return false;
      }
      // Create a new device, or update the current instance
      vm.device.gateway = vm.gateway;
      vm.device.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        Socket.emit('updateDevice', {});
        $state.go('devices.list'); // should we send the User to the list or the updated Device's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Device saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Device save error!' });
      }
    }
  }
}());
