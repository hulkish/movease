var app = window.app || {};
app.views = app.views || {};

app.views.AppView = (function(app) {
  var _movieService;

  function AppView(element, movieService) {
    _movieService = movieService;
    this.$el = element;
    this._searchFormView = new app.views.SearchFormView(document.getElementById('searchForm'));
    this._movieListView = new app.views.MovieListView(document.getElementById('movieList'), movieService);
    this._searchFormView.addListener('submit', onSearchSubmit.bind(this));
  }

  AppView.prototype.render = function(state) {
    console.log('AppView.render()', state);
    this._movieListView.render.call(this._movieListView, state.movieList);
  };

  function onSearchSubmit(data) {
    _movieService.lookupTitle(data.movieTitle);
  }

  return AppView;

})(app);
