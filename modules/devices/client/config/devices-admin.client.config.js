(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('devices.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('sidebar', 'admin', {
      title: 'Manage Devices',
      state: 'admin.devices.list'
    });
  }
}());
