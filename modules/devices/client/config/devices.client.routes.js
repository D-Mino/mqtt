(function () {
  'use strict';

  angular
    .module('devices.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('devices', {
        abstract: true,
        url: '/devices',
        template: '<ui-view/>'
      })
      .state('devices.list', {
        url: '',
        templateUrl: '/modules/devices/client/views/list-devices.client.view.html',
        controller: 'DevicesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Devices List'
        }
      })
      .state('devices.create', {
        url: '/create',
        templateUrl: '/modules/devices/client/views/form-devices.client.view.html',
        controller: 'DevicesController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          deviceResolve: newDevice
        }
      })
      .state('devices.edit', {
        url: '/:deviceId/edit',
        templateUrl: '/modules/devices/client/views/form-devices.client.view.html',
        controller: 'DevicesController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          deviceResolve: getDevice
        }
      });
  }

  getDevice.$inject = ['$stateParams', 'DevicesService'];

  function getDevice($stateParams, DevicesService) {
    return DevicesService.get({
      deviceId: $stateParams.deviceId
    }).$promise;
  }

  newDevice.$inject = ['DevicesService'];

  function newDevice(DevicesService) {
    return new DevicesService();
  }
}());
