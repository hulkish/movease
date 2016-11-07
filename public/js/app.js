var app = window.app || {};

(function(app) {

  var store = new app.Store();
  var movieService = new app.MovieService(store);
  var appView = new app.views.AppView(document.getElementById('moveaseApp'), movieService);
  store.subscribe(appView.render.bind(appView));

  movieService.getFavorites();

})(app);
