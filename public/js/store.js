var app = window.app || {};


app.Store = (function(app) {
  var subscribers = [];

  function Store() {
    this.state = {};
  }

  Store.prototype.getState = function() {
    return this.state;
  };

  Store.prototype.dispatch = function(state) {
    this.prevState = this.state;
    Object.assign(this.state, state);
    this.notify();
  };

  Store.prototype.subscribe = function(fn) {
    var index = subscribers.push(fn) - 1;

    return function() {
      subscribers.splice(index, 1);
    };
  };

  Store.prototype.notify = function() {
    subscribers.forEach(function(subscriber) {
      subscriber(this.prevState, this.state);
    }.bind(this));
  };

  Store.prototype.updateState = function(state) {
    this.dispatch(state);
  };

  return Store;
})(app);
