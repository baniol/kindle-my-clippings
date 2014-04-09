// var assert = require('chai').assert;
// // var should = chai.should();
var Clip = require('../kindle-my-clippings');

// var clip = new Clip();

// describe('Array', function(){

//   describe('#indexOf()', function(){
//     it('should return -1 when the value is not present', function(){
//       assert.equal(-1, [1,2,3].indexOf(5));
//       assert.equal(-1, [1,2,3].indexOf(0));
//     });
//   });

// });

// Require chai.js expect module for assertions
var expect = require('chai').expect;

// Create a new test suite for our Bank Account
suite("Kindle clipping Tests", function() {

    var clip;

    setup(function () {
      clip = new Clip();
    });

    // Define a pending test
    test("should exist", function() {
        expect(clip).to.be.ok;
    });

    test('file reading', function(){
      clip.getFileContent(__dirname + '/' + 'My Clippings.txt', function (data) {
        expect(data).to.be.a('string');
      });
    });

    test('split file contents', function() {
      clip.getFileContent(__dirname + '/' + 'My Clippings.txt', function (data) {
        var output = clip.splitFileIntoRecords(data);
        expect(data).to.be.instanceof(Array);
        // expect(clip).to.be.ok;
      });
    });

});