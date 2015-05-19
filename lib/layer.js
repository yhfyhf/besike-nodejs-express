var p2re = require('path-to-regexp');

var Layer = function(path, fn) {
    this.handle = fn;
    this.match = function(pattern) {
        pattern = decodeURIComponent(pattern);
        if (path[path.length - 1] == '/') {
            path = path.substring(0, path.length - 1);
        }
        var names = [];
        var re = p2re(path, names, {end: false});
        if (re.test(pattern)) {
            m = re.exec(pattern);
            var params = {};
            for (var i = 0; i < names.length; i++) {
                params[names[i]['name']] = m[i+1];
            }
            return {
                "path": m[0],
                "params": params
            };
        }
    };
};

module.exports = Layer;
