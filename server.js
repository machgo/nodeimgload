var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");
var fs = require("fs");

var port = process.env.PORT || 8080;
var config = require("./config.js");

var app = express();
var mongoose = require('mongoose');
mongoose.connect(config.db[process.env.NODE_ENV]);

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/pictures', bodyParser.json());
app.use('/upload', bodyParser.raw());
app.use(function(req, res, next) {
    var data = new Buffer('');
    req.on('data', function(chunk) {
        data = Buffer.concat([data, chunk]);
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
});
 
var router = express.Router();

router.use(function (req, res, next) {
    console.log("received...");
    console.log(req.body);
    next();
});

router.get('/', function (req, res) {
    res.sendFile('./public/index.html', { root: __dirname });
});

var picturesRoutes = require("./app/routes/pictures.js");
router.get('/pictures', picturesRoutes.index);
router.get('/pictures/:picture_id', picturesRoutes.show);
router.post('/pictures', picturesRoutes.create);

router.get('/upload/:picture_id', picturesRoutes.getBinary);
router.post('/upload/:picture_id', picturesRoutes.setBinary);
    
app.use('/api', router);
app.listen(port);