var utils = require('./utils');
var chai = require('chai');
var should = chai.should();

var Picture = require("../app/models/picture.js");

describe("Pictures: models", function () {
    it('should create a new Picture', function (done) {
        var p = {name: 'testpic'};
        Picture.create(p, function (err, createdPicture) {
            should.not.exist(err);
            createdPicture.name.should.equal('testpic');
            done();
        });
    });
});