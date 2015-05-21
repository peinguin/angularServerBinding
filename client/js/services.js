'use strict';

/* Services */
 
var phonecatServices = angular.module('phonecatServices',[] )
  , socket = io()
;

phonecatServices.factory('Phone', function(){
  var events = []
    , Resource = {}
  ;
  Resource.wait = function(f, args) {
    socket.once('connect', function() {
      this[f].apply(this, args);
    }.bind(this));
  };
  Resource.all = function(cb) {
    if (!socket.connected) {
      return  this.wait('all', arguments);
    }
    var query = 'phones/all';
    socket.on(query, cb);
    events.push(query);
    socket.emit('subscribe', query);
  };
  Resource.one = function(id, cb) {
    if (!socket.connected) {
      return  this.wait('all', arguments);
    }
    var query = 'phones/' + id
    socket.on(query, cb);
    events.push(query);
    socket.emit('subscribe', query);
    return defer.promise;
  };
  Resource.stop = function() {
    while(events.length > 0) {
      socket.removeAllListeners(events.pop());
    }
  };
  return Resource;
});

