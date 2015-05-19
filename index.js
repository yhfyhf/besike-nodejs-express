var http = require('http');
var Layer = require('./lib/layer');

module.exports = function() {

    var app = function(req, res, next) {
        var index = 0;  // entry of app.stack
        var count = 0;  // 用来记录_next()被调用的次数
        var existsError = false;
        var err;
        var _next = function(arg) {
            if (arg) {
                err = arg;
                existsError = true;
            }
            count++;
        };
        var end;
        while (index < app.stack.length && count == index) {
            var layer = app.stack[index++];
            var m;
            console.log(req.url);
            if (layer.match(req.url) && layer.match(req.url).hasOwnProperty("path")) {
                var params = layer.match(req.url).params;
                if (params.hasOwnProperty('a')) {
                    end = params['a'];
                } else {
                    end = "";
                }
                m = layer.handle;
            } else {
                m = layer;
            }
            if (m.hasOwnProperty('use')) { // middleware is a subapp
                var subapp = m;
                console.log(subapp);
                var temp = index;
                subapp.stack.forEach(function(_m) {
                    app.stack.splice(temp++, 0, _m);
                });
                count++;
                continue;
            }
            if (!existsError) {
                try {
                    if (m.length == 4) { // if there's an error, skip error middlewares
                        count++;
                        continue;
                    }
                    m(req, res, _next);
                } catch (e) {
                    console.log(e);
                    existsError = true;
                }
            } else {
                if (m.length == 3) { // skip normal middlewares
                    count++;
                    continue;
                }
                m(err, req, res, _next);
            }
        }
        if (!existsError) {
            res.statusCode = 404;
        } else {
            res.statusCode = 500;
        }

        res.end(end);
    };

    app.handle = function(req, res, next) {
    };

    app.listen = function(port, done) {
        var server = http.createServer(app);
        server.listen(port, done);
        return server;
    };

    app.stack = [];

    app.use = function(path, middleware) {
        var layer;
        if (typeof(path) == "function") {
            middleware = path;   // here path is a middleware
            layer = new Layer("/", middleware);
        } else {
            layer = new Layer(path, middleware);
        }
        app.stack.push(layer);
    };

    return app;
};