var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Picture', PictureSchema);