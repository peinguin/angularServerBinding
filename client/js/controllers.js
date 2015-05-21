'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    Phone.stop();
    Phone.all(function(phones) {
      $scope.phones = phones;
    });
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    Phone.stop();
    Phone.one(
      $routeParams.phoneId,
      function(phone) {
        $scope.phone = phone;
        $scope.mainImageUrl = phone.images[0];
      }
    );

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
