var express = require('express');
var app = express();
var fs = require("fs");

app.use(express.json());// to support JSON-encoded bodies
app.use(express.urlencoded({// to support URL-encoded bodies
  extended: true
})); 

// CORS logic to allow requests across orgins
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);

    console.log(`IP Requesting: ${req.socket.remoteAddress}`);

    // Pass to next layer of middleware
    next();
});

// Grabs a predefined list 
app.get('/getList', function(req, res) {
    fs.readFile(__dirname + "/data/Predefined.json", function(err, data) {
        if(err){
            console.log(err);
            res.end(JSON.stringify("FAULTED"));
            return;
        }

        res.end(data);
    });
});

// Gets the list for today
app.get('/getListToday', function(req, res) {
    let filename = getListFilename();

    fs.readFile(filename, function(err, data) {
        if(err){
            console.log(err);
            res.end(JSON.stringify("FAULTED"));
            return;
        }

        res.end(data);
    });
});


// Gets the notes for today
app.get('/getNotesToday', function(req, res) {
    let filename = getNoteFilename();

    fs.readFile(filename, function(err, data) {
        if(err){
            console.log(err);
            res.end(JSON.stringify("FAULTED: " + err));
            return;
        }

        res.end(data);
    });
});

// Checks to see if a list has been created for today.
app.get('/hasListToday', function(req, res) {
    let filename = getListFilename();
    let doesExist = fs.existsSync(filename);
    res.end(JSON.stringify(doesExist));
});

app.post('/submitList', function(req, res) {
    console.log(req.body);

    let filename = getListFilename();
    fs.writeFile(filename, JSON.stringify(req.body), function(err) {
        if(err){
            console.log(err);
            res.end(JSON.stringify(false));
            return;
        }

        res.end(JSON.stringify(true));
    });
});

app.post('/submitNotes', function(req, res) {
    console.log(req.body);

    let filename = getNoteFilename();
    fs.writeFile(filename, JSON.stringify(req.body), function(err) {
        if(err){
            console.log(err);
            res.end(JSON.stringify(false));
            return;
        }

        res.end(JSON.stringify(true));
    });
});

app.post('/removeList', function(req, res) {
    let filename = getListFilename();
    fs.unlinkSync(filename);

    // Let's make sure it's gone
    let doesExist = fs.existsSync(filename);
    res.end(JSON.stringify(doesExist));
});

app.post('/removeNotes', function(req, res) {
    let filename = getNoteFilename();
    fs.unlinkSync(filename);

    // Let's make sure it's gone
    let doesExist = fs.existsSync(filename);
    res.end(JSON.stringify(doesExist));
});

// Kick off the listener
var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`API Handler started on interface http://${host}:${port}/`);
});

function getListFilename() {
    let date = new Date();
    return __dirname + `/data/${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-list.json`;
}

function getNoteFilename() {
    let date = new Date();
    return __dirname + `/data/${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-note.json`;
}