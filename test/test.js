var Clippings = require('../clippings.js')
var parseLines = require('../lib/parselines.js')

var Clip = function()
{
    var self = this;
    var _data = null;
    self.getFileContent = function(fileName, cb) {
        Clippings._getFileContents(fileName, function(data) {
            _data = data
            cb(data);
        })
    };

    self.splitFileIntoRecords = function(text) {
        return Clippings._splitIntoRecords(text);
    };

    self.splitRecord = function(record) {
        return Clippings._splitRecord(record);
    };

    self.getFirstLine = function(lines) {
        return parseLines.firstLine(lines);
    };
    self.getSecondLine = function(lines) {
        return parseLines.secondLine(lines);
    };
    self.getThirdLine = function(lines) {
        return parseLines.thirdLine(lines);
    };

}

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
      clip.getFileContent([__dirname + '/' + 'My Clippings.txt'], function (data) {
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
      expect(record[0]).to.equal('The 7 Habits of Highly Effective People: Powerful Lessons in Personal Change (25th Anniversary Edition) (Covey, Stephen R.)');
      expect(record[1]).to.equal('- Your Highlight on Location 1504-1509 | Added on Wednesday, February 3, 2016 8:48:47 AM');
      expect(record[2]).to.equal('Even the most intelligent animals have none of these endowments. To use a computer metaphor, they are programmed by instinct and/or training. They can be trained to be responsible, but they can’t take responsibility for that training; in other words, they can’t direct it. They can’t change the programming. They’re not even aware of it. But because of our unique human endowments, we can write new programs for ourselves totally apart from our instincts and training. This is why an animal’s capacity is relatively limited and man’s is unlimited. But if we live like animals, out of our own instincts and conditioning and conditions, out of our collective memory, we too will be limited.');
    });

    test('get title and author', function() {
      var first = clip.getFirstLine(firstLine);
      expect(first.author).to.equal('Covey, Stephen R.');
      expect(first.title).to.equal('The 7 Habits of Highly Effective People: Powerful Lessons in Personal Change (25th Anniversary Edition)');
    });

    test('get time', function() {
      var second = clip.getSecondLine(firstLine);
      expect(second.type).to.equal('Highlight');
      expect(second.location).to.equal('1504-1509');
      expect(second.time).to.equal('Wednesday, February 3rd, 2016, 8:48:47 AM');
    });

});
