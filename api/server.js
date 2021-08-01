var express = require('express');
var app = express();
var fs = require("fs");

// CORS logic to allow requests across orgins
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


//API calls
app.get('/getPredefinedList', function(req, res) {
    fs.readFile(__dirname + "/data/Predefined.json", function(err, data) {
        console.log(`Returned data:\n ${data}`);
        res.end(data);
    });
});

app.get('/getTodaysList', function(req, res) {
    fs.readFile(__dirname + "/data/Predefined.json", function(err, data) {
        console.log(`Returned data:\n ${data}`);
        res.end(data);
    });
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`API Handler started on interface http://${host}:${port}/`);
});