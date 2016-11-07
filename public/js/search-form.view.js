var app = window.app || {};
app.views = app.views || {};

app.views.SearchFormView = (function(app) {

  function SearchFormView(element) {
    this.$el = element;
    this.$el.addEventListener('submit', onFormSubmit.bind(this));
    this._listeners = [];
  }

  SearchFormView.prototype.addListener = function(type, callback) {
    this._listeners.push({
      type: type,
      callback: callback
    });
  };

  SearchFormView.prototype.removeListeners = function() {
    this._listeners = [];
  };

  SearchFormView.prototype.destroy = function() {
    this.removeListeners();
    this.$el.parentElement.removeChild(this.$el);
    delete this.$el;
  };

  SearchFormView.prototype.invalidate = function() {
    while (this.$el.firstChild) {
      this.$el.removeChild(this.$el.firstChild);
    }
  };

  function onFormSubmit(e) {
    e.preventDefault();

    var data = {
      movieTitle: this.$el.elements['movieTitle'].value
    };
    var callback = this._listeners.find(listener => listener.type === e.type).callback;
    if (callback && typeof callback === 'function') {
      callback(data);
    }
  }

  return SearchFormView;

})(document, app);
