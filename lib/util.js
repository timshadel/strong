function merge(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

function isInteger(s) {
    return Math.ceil(s) == Math.floor(s);
}

if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/%{([^{}]*)}/g,
            function (a, b) {
                o.navigate = function (path) {
                  try {
                    return path.split('.').reduce(function(obj,i){ return obj[i] }, this);
                  } catch (e) {
                    return undefined;
                  }
                };
              
                var r = o.navigate(b);
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}
