(function () {
  'use strict';

  describe('Devices Route Tests', function () {
    // Initialize global variables
    var $scope,
      DevicesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DevicesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DevicesService = _DevicesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('devices');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/devices');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('devices.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/devices/client/views/list-devices.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DevicesController,
          mockDevice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('devices.view');
          $templateCache.put('/modules/devices/client/views/view-device.client.view.html', '');

          // create mock device
          mockDevice = new DevicesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Device about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          DevicesController = $controller('DevicesController as vm', {
            $scope: $scope,
            deviceResolve: mockDevice
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:deviceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.deviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            deviceId: 1
          })).toEqual('/devices/1');
        }));

        it('should attach an device to the controller scope', function () {
          expect($scope.vm.device._id).toBe(mockDevice._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/devices/client/views/view-device.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/devices/client/views/list-devices.client.view.html', '');

          $state.go('devices.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('devices/');
          $rootScope.$digest();

          expect($location.path()).toBe('/devices');
          expect($state.current.templateUrl).toBe('/modules/devices/client/views/list-devices.client.view.html');
        }));
      });
    });
  });
}());
