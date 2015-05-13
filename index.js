var http = require('http');

module.exports = function(){
    var app = function(req, res){
        res.statusCode = 404;
        res.end();
    };

    app.listen = function(port, done){
        var server = http.createServer(app);
        server.listen(port, done);
        return server;
    };

    return app;
};