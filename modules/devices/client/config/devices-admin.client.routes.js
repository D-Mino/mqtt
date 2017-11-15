(function () {
  'use strict';

  angular
    .module('devices.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.devices', {
        abstract: true,
        url: '/devices',
        template: '<ui-view/>'
      })
      .state('admin.devices.list', {
        url: '',
        templateUrl: '/modules/devices/client/views/admin/list-devices.client.view.html',
        controller: 'DevicesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.devices.create', {
        url: '/create',
        templateUrl: '/modules/devices/client/views/admin/form-devices.client.view.html',
        controller: 'DevicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          deviceResolve: newDevice
        }
      })
      .state('admin.devices.edit', {
        url: '/:deviceId/edit',
        templateUrl: '/modules/devices/client/views/admin/form-devices.client.view.html',
        controller: 'DevicesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
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
