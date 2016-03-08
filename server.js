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

router.route('/pictures')
    .post(function (req, res) {
        var pic = new Picture();
        pic.name = req.body.name;
        pic.created_at = new Date();
        pic.data = null;
        console.log(req.body);
        
        pic.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'Pic created..'});
        });
    })
    .get(function (req, res) {
        Picture.find(function (err, pictures) {
            if (err)
                res.send(err);
            res.json(pictures);
        });
    });
    
router.route('/pictures/:picture_id')
    .get(function (req, res) {
        Picture.findById(req.params.picture_id, function (err, picture) {
            if (err)
                res.send(err);
            res.json(picture)
        });
    });

router.route('/upload/:picture_id')
    .get(function (req, res) {
        Picture.findById(req.params.picture_id, function (err, picture) {
            if (err)
                res.send(err);
            res.contentType("image/png");
            res.send(picture.data);
        });
    })
    .post(function (req, res) {
        var buf = req.rawBody;
        Picture.findById(req.params.picture_id, function (err, picture) {
            if (err)
                res.send(err);
            picture.data = buf;
            picture.save(function (err) {
                if (err)
                    res.send(err);
                res.sendStatus(200);
            })
        });                   
        console.log(req); 
    });
    
app.use('/api', router);

var Picture = require('./app/models/picture');

app.listen(port);