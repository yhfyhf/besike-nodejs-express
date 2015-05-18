var Layer = function(path, fn) {
    this.handle = fn;
    this.match = function(pattern) {
        if (pattern.indexOf(path) === 0) {
            return {
                "path": path
            };
        }
    };
};

module.exports = Layer;
