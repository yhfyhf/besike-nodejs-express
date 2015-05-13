#!/usr/bin/env node
var express = require("myexpress");
var app = express();

var http = require("http");
var server = http.createServer(app);
console.log("Starting http server on http://localhost:4000");
server.listen(4000);
