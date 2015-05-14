var http = require('http');

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
        while (index < app.stack.length && count == index) {
            var m = app.stack[index++];
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
        res.end();
    };

    app.listen = function(port, done) {
        var server = http.createServer(app);
        server.listen(port, done);
        return server;
    };

    app.stack = [];

    app.use = function(middleware) {
        app.stack.push(middleware);
    };

    return app;
};