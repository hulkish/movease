var app = window.app || {};

app.util = (function() {
  return {
    request: request,
    isImageLoadable: isImageLoadable,
  };

  function request(method, url, data) {
    data = data && JSON.stringify(data) || null;
    method = method && method.toUpperCase() || 'GET';
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open(method, url);
      if (method !== 'GET') {
        req.setRequestHeader('Content-Type', 'application/json');
      }
      req.onload = function() {
        if (req.status === 200) {
          try {
            var parsedJSON = JSON.parse(req.response);
            resolve(parsedJSON);
          } catch (e) {
            resolve(req.response);
          }
        } else {
          reject({
            status: req.status,
            statusText: req.statusText
          });
        }
      };
      req.onerror = function(err) {
        reject(Error(err));
      };
      req.send(data);
    });
  }

  function isImageLoadable(url) {
    return new Promise(function(resolve, reject) {
      var tester = new Image();
      tester.onload = () => {
        resolve(url);
      };
      tester.onerror = (err) => {
        reject(err);
      };
      tester.src = url;
    });
  }

})();
