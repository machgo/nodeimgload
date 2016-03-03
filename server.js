var express = require("express");
var path = require("path");

var mongoose = require('mongoose');
mongoose.connect('mongodb://...');

var app = express();
var port = 8080;
 
var router = express.Router();

router.get('/', function (req, res) {
    res.json({message: 'hello api'});
});

app.use('/api', router);
app.listen(port);