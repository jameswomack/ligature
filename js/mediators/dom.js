var EventEmitter = require('events').EventEmitter;

function DomMediator(el, cb){
  this.element = el;
  this._attributes = {};
  setTimeout(function(){
    this.observer.observe(this.element, this.flags);
    this.on('change', cb);
  }.bind(this), 0);
}

DomMediator.prototype = new EventEmitter();

Object.defineProperty(DomMediator.prototype, 'flags', {
  value: {subtree:true, characterData:true, characterDataOldValue:true}
});

Object.defineProperty(DomMediator.prototype, 'observer', {
  get: function(){
    if (!this._attributes.observer) {
      this._attributes.observer = new MutationObserver(function(events, observer){
        (events[0].target.parentNode === this.element) && this.emit('change', events, observer);
      }.bind(this));
    }
    return this._attributes.observer;
  }
});

module.exports = DomMediator;
