/*jshint -W079 */
var $ = require('jquery');
var urlComponents = require('./environment').urlComponents();
var Dom = require('./mediators/dom');

var attribute = 'data-text';

function clone(o) {
  return integrate({}, o);
}

function integrate(p, o) {
  Object.getOwnPropertyNames(o).forEach(function(key){
    if(o[key] == null){
      throw new Error('Cannot integrate null value at key "' + key + '"');
    }
    p[key] = o[key];
  });
  return p;
}

function pushState(state, title, path) {
  for (var key in state) {
    if (state[key] == null) {
      throw new Error('Cannot add state null value at key "' + key + '"');
    }
  }
  history.pushState.apply(history, arguments);
}

var Index = function Index(){
  this._id = this.constructor.name;
  this._map = {};
  window.model = this._model = {};
  this._attributes = {};
  window.onpopstate = function(popStateEvent){
    this.updateModel(popStateEvent.state);
  }.bind(this);
};

Index.prototype.observeElement = function(el, cb){
  new Dom(el, cb);
};

Index.prototype.magicizeKey = function(o, key){
  var index = this;
  index._attributes[key] = null;

  Object.defineProperty(o, key, {
    get: function(){
      return index._attributes[key];
    },

    set: function(newValue){
      index._attributes[key] = newValue;
      var $element = $('*['+attribute+'='+key+']');

      // Check if history state is already up to date
      if(index._pushOnModelChanges && history.state[key] !== newValue){
        pushState(clone(index._model), null, '/'+index._id+'/'+key);
      }

      // Check if view content is already up to date
      ($element.text() !== newValue) && $element.text(newValue);
    }
  });
};

Index.prototype.hydrateModel = function(){
  this.updateModel(this.defaultData());
};

Index.prototype.updateModel = function(state){
  // Don't integrate null
  state && integrate(this._model, state);
};

// Create setters and getters
Index.prototype.synthesizeModelProperties = function(){
  Object.getOwnPropertyNames(this.defaultData()).forEach(function(key){
    this.magicizeKey(this._model, key);
  }.bind(this));
};

Index.prototype.bindModelToView = function(){
  this.synthesizeModelProperties();
  this.hydrateModel();

  $('*['+attribute+']').each(function(index, element){
    var $element = $(element);
    var key = element.getAttribute(attribute);

    $element.html(this.defaultData()[key]);
    this._map[key] = $element;

    var change = (function change(events){
      if(events[0].target.parentNode != element) {
        return;
      }
      var newValue = events[0].target.parentNode.innerText;
      var oldValue = this._model[key];
      if (newValue !== oldValue) {
        console.log('change', events[0].target.parentNode, events[0].target.parentNode.innerText);
        this._model[key] = newValue;
      }
    }).bind(this);

    this.observeElement(element, change);
  }.bind(this));
};

Index.prototype.defaultData = function(){
  return {
    title: 'Foobar',
    pre:   urlComponents,
    foo:   'bar',
  };
};

Index.prototype.enablePushState = function(){
  this._pushOnModelChanges = true;
};

Index.prototype.render = function(){
  this.bindModelToView();
  this.enablePushState();
};

window.onload = function(){
  var index = new Index();
  index.render();
};

module.exports = Index;
