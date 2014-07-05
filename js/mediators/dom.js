var EventEmitter = require('events').EventEmitter;

function DomMediator(){
  EventEmitter.call(this);
  this.observer = new MutationObserver(function(){
    this.emit.apply(this, ['change'].concat(arguments));
  }.bind(this));
}

var shared = null;
DomMediator.shared = function(){
  !shared && (shared = new DomMediator());
  return shared;
};

DomMediator.prototype = new EventEmitter();

Object.defineProperty(DomMediator.prototype, 'flags', {
  value: {subtree:true, characterData:true, characterDataOldValue:true}
});

DomMediator.prototype.observeElement = function(el){
  this.observer.observe(el, this.flags);
};

module.exports = DomMediator;
