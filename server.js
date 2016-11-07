var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var app = express();
var data;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.body);
  data = JSON.parse(fs.readFileSync('./data.json'));
  res.set('Content-Type', 'application/json');
  next();
});

app.get('/favorites', function(req, res) {
  res.send(data);
});

app.post('/favorites', function(req, res) {
  if (!req.body || !req.body.title || !req.body.imdbId) {
    res.status(400).send({
      error: 'Bad Request'
    });
    return;
  }

  toggleFavorite(req.body);
  res.send(data);
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

function toggleFavorite(reqBody) {
  var locatedMovieIndex = data.findIndex(movie => movie.imdbId === reqBody.imdbId);

  if (locatedMovieIndex > -1) {
    console.log('located favorite, removing it');
    data.splice(locatedMovieIndex, 1);
  }

  data.push(reqBody);
  fs.writeFile('./data.json', JSON.stringify(data));
}
