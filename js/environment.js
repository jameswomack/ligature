var url = require('url');
var stringify = JSON.stringify;

function urlComponents(){
  var href = window.location.href;
  return stringify(url.parse(href));
}

module.exports = {
  urlComponents: urlComponents
};
