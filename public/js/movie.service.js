var app = window.app || {};

app.MovieService = (function(app) {
  var _store;

  function MovieService(store) {
    _store = store;
  }

  MovieService.prototype.isFavorited = function(imdbId) {
    var locatedFavorite = locateFavoriteById(imdbId);
    return typeof locatedFavorite !== 'undefined';
  };

  MovieService.prototype.lookupTitle = function(title) {
    title = encodeURIComponent((title || '').trim());
    return app.util.request('GET', 'http://www.omdbapi.com/?s=' + title)
    .then(function(data) {
      _store.updateState({
        movieList: [].concat(data && data.Search || [])
      });
      return data;
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  MovieService.prototype.getFavorites = function() {
    return app.util.request('GET', '/favorites')
      .then(function(data) {
        _store.updateState({
          favoriteList: data
        });
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  MovieService.prototype.setFavorite = function(imdbId, title) {
    return app.util.request('POST', '/favorites', {
      title: title,
      imdbId: imdbId
    })
      .then(function(data) {
        _store.updateState({
          favoriteList: data
        });
        return locateFavoriteById(imdbId);
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  function locateFavoriteById(id) {
    var state = _store.getState();
    return (state && state.favoriteList || [])
      .find(movie => movie.imdbID === id);
  }

  return MovieService;

})(app);
