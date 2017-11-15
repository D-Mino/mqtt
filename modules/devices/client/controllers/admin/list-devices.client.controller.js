(function () {
  'use strict';

  angular
    .module('devices.admin')
    .controller('DevicesAdminListController', DevicesAdminListController);

  DevicesAdminListController.$inject = ['$state', 'DevicesService', '$window', 'Notification'];

  function DevicesAdminListController($state, DevicesService, $window, Notification) {
    var vm = this;

    vm.devices = DevicesService.query();
    vm.remove = remove;
    vm.toggle = toggle;
    function remove(index) {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.devices[index].$remove(function() {
          vm.devices.splice(index, 1);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Device deleted successfully!' });
        });
      }
    }
    function toggle(device, order) {

      // Create a new device, or update the current instance
      device.gateway[order].status = !device.gateway[order].status;
      device.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Device successfully!' });
      }

      function errorCallback(res) {
        device.gateway[order].status = !device.gateway[order].status;
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Device error!' });
      }
    }
  }
}());
