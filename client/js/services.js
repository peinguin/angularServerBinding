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
    var query = 'all';
    socket.on(query, cb);
    events.push(query);
    socket.emit('subscribe', query);
  };
  Resource.one = function(id, cb) {
    if (!socket.connected) {
      return  this.wait('one', arguments);
    }
    var query = id;
    socket.on(query, cb);
    events.push(query);
    socket.emit('subscribe', query);
  };
  Resource.stop = function() {
    while(events.length > 0) {
      socket.removeAllListeners(events.pop());
    }
  };
  Resource.updateAll = function(photos) {
    socket.emit('update', 'all', photos);
  };
  Resource.updateOne = function(photo) {
    socket.emit('update', photo.id, photo);
  }
  return Resource;
});

