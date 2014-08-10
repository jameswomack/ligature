var integrate = exports.integrate = function integrate(p, o) {
  Object.getOwnPropertyNames(o).forEach(function(key){
    if(o[key] != null){
      //throw new Error('Cannot integrate null value at key "' + key + '"');
      p[key] = o[key];
    }
  });
  return p;
};

exports.clone = function clone(o) {
  return integrate({}, o);
};

