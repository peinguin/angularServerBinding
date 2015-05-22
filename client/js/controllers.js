'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    Phone.stop();
    Phone.all(function(phones) {
      $scope.$apply(function(){
	$scope.phones = phones;
      });
    });
    $scope.$watch('phones', _.debounce(function(newValue, oldValue) {
      if (!_.isObject(oldValue)) {
	return false;
      }
      Phone.updateAll(newValue);
    }, 1000), true);
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    Phone.stop();
    Phone.one(
      $routeParams.phoneId,
      function(phone) {
	$scope.$apply(function(){
          $scope.phone = phone;
          $scope.mainImageUrl = phone.images[0];
	});
      }
    );

    $scope.$watch('phone', _.debounce(function(newValue, oldValue) {
      if (!_.isObject(oldValue)) {
	return false;
      }
      Phone.updateOne(newValue);
    }, 1000), true);

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
