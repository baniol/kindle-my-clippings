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
    var clipData;
    var firstRecord;
    var firstLine;
    var added;

    setup(function () {
      clip = new Clip();
    });

    // Define a pending test
    test("should exist", function() {
        expect(clip).to.be.ok;
    });

    test('file reading', function(done){
      clip.getFileContent(__dirname + '/' + 'My Clippings.txt', function (data) {
        clipData = data;
        expect(data).to.be.a('string');
        done();
      });
    });

    test('if split clip data is an array', function() {
      var output = clip.splitFileIntoRecords(clipData);
      firstRecord = output[0];
      expect(output).to.be.instanceof(Array);
    });

    test('splitRecord method', function() {
      var record = clip.splitRecord(firstRecord);
      firstLine = record;
      expect(record[0]).to.equal('Developing Backbone.js Applications (Addy Osmani)');
      expect(record[1]).to.equal('- Highlight Loc. 242-43  | Added on Monday, 3 December 12 19:00:12 Greenwich Mean Time');
      expect(record[2]).to.equal('languages when implementing patterns in their projects, there are many lessons we can');
    });

    test('get title and author', function() {
      var first = clip.getFirstLine(firstLine);
      expect(first.author).to.equal('Addy Osmani');
      expect(first.title).to.equal('Developing Backbone.js Applications');
    });

    test('get time', function() {
      var second = clip.getSecondLine(firstLine);
      expect(second.type).to.equal('Highlight');
      expect(second.location).to.equal('242-43');
      expect(second.time).to.equal('Monday, December 3rd, 2012, 8:00:12 PM');
    });

});