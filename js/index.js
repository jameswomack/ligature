/*jshint -W079 */
var $ = require('jquery');
var Environment = require('./environment');
var Dom = require('./mediators/dom');

var attribute = 'data-text';

var Index = function Index(){
 this._map = {};
 this._model = {};
 this._attributes = {};
};

Index.prototype.observeElement = function(el, cb){
  Dom.shared().observeElement(el);
  Dom.shared().on('change', cb);
};

Index.prototype.magicizeKey = function(o, key){
  var self = this;
  this._attributes[key] = null;
  Object.defineProperty(o, key, {
    get: function(){
      return self._attributes[key];
    },
    set: function(newValue){
      self._attributes[key] = newValue;
      var $element = $('*['+attribute+'=' + key + ']');
      ($element.text() !== newValue) && $element.text(newValue);
    }
  });
};

Index.prototype.makeMap = function(){
  $('*['+attribute+']').each(function(index, element){    
    var $element = $(element);
    var key = element.getAttribute(attribute);

    var self = this;
    var change = function change(){
      console.log(arguments);
      var newValue = $element.context.innerText;
      var oldValue = self._model[key];
      (newValue !== oldValue) && (self._model[key] = $element.context.innerText);
    };

    $element.html(this.data()[key]);
    this._map[key] = $element;
    this.magicizeKey(this._model, key);
    this.observeElement(document.getElementsByTagName('h1')[0], change);
    this.observeElement(document.getElementsByTagName('pre')[0], change);
  }.bind(this));
};

Index.prototype.data = function(){
  return {
    title: 'Foobar',
    pre:   Environment.urlComponents()
  };
};

Index.prototype.render = function(){
  var $titleElement = $('*[data-text="title"]');
  $titleElement.html('Foobar');
  this.makeMap();
};

var index = window.index = new Index();
index.render();

module.exports = Index;
