var app = window.app || {};
app.views = app.views || {};

app.views.MovieListView = (function(document, app) {
  var _movieService;

  function MovieListView(element, movieService) {
    _movieService = movieService;
    this.$el = element;
    this._onFavoriteClick = onFavoriteClick.bind(this);
    this.addListeners();

    var firstRowEl = document.createElement('div');
    firstRowEl.classList.add('row', 'movies__container');
    this.$el.appendChild(firstRowEl);
    this.$el = firstRowEl;
  }

  MovieListView.prototype.addListeners = function() {
    this.$el.addEventListener('click', this._onFavoriteClick);
  };

  MovieListView.prototype.removeListeners = function() {
    this.$el.removeEventListener('click', this._onFavoriteClick);
  };

  MovieListView.prototype.destroy = function() {
    this.$el.parentElement.removeChild(this.$el);
    delete this.$el;
  };

  MovieListView.prototype.invalidate = function(data) {
    var locatedMovieData;
    for (var i = this.$el.children.length-1; i > -1; --i) {
      locatedMovieData = data.find(movie => movie.imdbId === this.$el.children[i]);
      if (!locatedMovieData) {
        this.$el.removeChild(this.$el.children[i]);
      }
    }
  };

  MovieListView.prototype.render = function(data) {
    if (!data) {
      return;
    }
    // this.invalidate(data);

    var children = Array.prototype.slice.call(this.$el.children);
    console.log('rowEl', this.$el)
    data.forEach(movie => {
      // var existingMovieEl = this.$el.querySelector(`.movie__container[data-imdb-id="${movie.imdbID}"]`);
      var existingMovieEl = children.find(el => {
        return el.dataset.imdbId === movie.imdbID
      });

      var isFavorited = _movieService.isFavorited(movie.imdbID);
      if (existingMovieEl) {
        if (isFavorited) {
          existingMovieEl.classList.add('is-active');
        } else {
          existingMovieEl.classList.remove('is-active');
        }
      } else {
        var $movieEl = renderMovieEl(movie);
        this.$el.appendChild($movieEl, isFavorited);
      }
    });
  };

  function renderMovieEl(data, favorite) {
    var movieEl = document.createElement('div');
    movieEl.dataset.imdbId = data.imdbID;
    movieEl.classList.add('col', 'movie__container');
    movieEl.innerHTML = `
      <div class="card">
        <div class="card__content">
          <div class="row">
            <div class="col is-not-fluid">
              <img class="poster" src="${data.Poster}" onerror="this.src='http://placehold.it/110x150'">
            </div>
            <div class="col">
              <ul class="list-unstyled">
                <li><strong>Title:</strong> ${data.Title}</li>
                <li><strong>Year:</strong> ${data.Year}</li>
              </ul>
              <a href="javascript:void(0)"
                class="btn__favorite${favorite ? ' is-active' : ''}"
                data-imdb-title="${data.title}"
                data-imdb-id="${data.imdbID}"></a>
            </div>
          </div>
        </div>
    `;

    return movieEl;
  }

  function onFavoriteClick(e) {
    var title = e.target.dataset && e.target.dataset.imdbId;
    var imdbId = e.target.dataset && e.target.dataset.imdbId;
    if (e.target.classList.contains('btn__favorite') && title && imdbId) {
      e.target.classList.add('spinner');
      var timePassed = Date.now();
      _movieService.setFavorite(imdbId, title)
        .then(function(data) {
          setTimeout(function() {
            e.target.classList.remove('spinner');
          }, Math.min(2500, Date.now()-timePassed));
        });
    }
  }

  return MovieListView;

})(document, app);
