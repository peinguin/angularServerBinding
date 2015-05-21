'use strict';

/* Services */
 
var phonecatServices = angular.module('phonecatServices',[] )
  , socket = io()
;

phonecatServices.factory('Phone', ['$q', function($q){
  var events = [];
  socket.on('phones');
  return {
    wait: function(f, args) {
      return $q(function(resolve, reject){
	socket.once('connect', function() {
	  resolve(this[f].apply(this, args));
	}.bind(this));
      }.bind(this));
    },
    all: function(cb) {
      if (!socket.connected) {
	return  this.wait('all', arguments);
      }
      var query = 'phones/all'
        ,  defer = $q(function(resolve, reject) {
	  socket.on(query, resolve);
	})
      ;
      socket.on(query, function () {
	console.log(query, arguments);
      });
      events.push(query);
      socket.emit('subscribe', query);
      return defer;
    },
    one: function(id, cb) {
      if (!socket.connected) {
	return  this.wait('all', arguments);
      }
      var query = 'phones/' + id
        , defer = $q(function(resolve, reject) {
	  socket.on(query, resolve);
	})
      ;
      socket.on(query, function () {
	console.log(query, arguments);
      });
      events.push(query);
      socket.emit('subscribe', query);
      return defer;
    },
    stop: function() {
      while(events.length > 0) {
	socket.removeAllListeners(events.pop());
      }
    }
  }
}]);

