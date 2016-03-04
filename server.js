var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");

var port = 8080;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
var router = express.Router();

router.use(function (req, res, next) {
    console.log("received...");
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

app.use('/api', router);

var Picture = require('./app/models/picture');


app.listen(port);