function merge(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

function access(obj,i) {
  return obj[i]
}

function mkdir_p(obj,i) {
  var result = obj[i];
  if (typeof result === "undefined" || result === null) obj[i] = {};
  return obj[i]
}

if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o.navigate(b);
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}

if (!Object.prototype.navigate) {
    Object.prototype.navigate = function (path) {
      try {
        return path.split('.').reduce(function(obj,i){ return obj[i] }, this);
      } catch (e) {
        return undefined;
      }
    };
}

if (!Object.prototype.putAtPath) {
    Object.prototype.putAtPath = function (path, value) {
      var keypath = path.split('.');
      var key = keypath.pop();
      
      var putPoint = keypath.reduce(
        function(obj,i) {
            var result = obj[i];
            if (typeof result === "undefined" || result === null) obj[i] = {};
            return obj[i]
          }
        , this);

      putPoint[key] = value;
    };
}

if (!Object.prototype.mergeAtPath) {
    Object.prototype.mergeAtPath = function (path, object) {
      var mergePoint = path.split('.').reduce(
        function(obj,i) {
            var result = obj[i];
            if (typeof result === "undefined" || result === null) obj[i] = {};
            return obj[i]
          }
        , this);

      merge(mergePoint, object);
    };
}

