(function () {
  'use strict';

  angular
    .module('devices.services')
    .factory('DevicesService', DevicesService);

  DevicesService.$inject = ['$resource', '$log'];

  function DevicesService($resource, $log) {
    var Device = $resource('/api/devices/:deviceId', {
      deviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Device.prototype, {
      createOrUpdate: function () {
        var devices = this;
        return createOrUpdate(devices);
      }
    });

    return Device;

    function createOrUpdate(devices) {
      if (devices._id) {
        return devices.$update(onSuccess, onError);
      } else {
        return devices.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(devices) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
