var express = require("../");
var request = require("supertest");
var http = require("http");
var expect = require("chai").expect;

describe("app", function() {
    var app = express();

    describe("create http server", function() {
        it("responds to /foo with 404", function(done) {
            var server = http.createServer(app);
            // console.log(request(server).get("/foo"));
            request(server).get("/foo").expect(404).end(done);
        });
    });

    describe("the listen method", function() {
        var port = 7000;

        before(function(done) {
            server = app.listen(port, done);
        });

        it("should return an http.Server", function() {
            expect(server).to.be.instanceof(http.Server);
        });

        it("responds to /foo with 404", function(done) {
            request("http://localhost:" + port).get("/foo").expect(404).end(done);
        });
    });
});
