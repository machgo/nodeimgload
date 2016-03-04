var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
    name: String,
    created_at: Date,
    data: Buffer
});

module.exports = mongoose.model('Picture', PictureSchema);