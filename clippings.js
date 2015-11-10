var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var parseLines = require('./lib/parselines')

var fileName;

module.exports.getObject = getObject;
module.exports.getTitles = getTitles;
module.exports.getBook = getBook;
module.exports.getText = getText;

function getObject(file, cb) {
  fileName = file;
  getFileContents(function (content) {
    cb(parseContent(content));
  });
}

function getFileContents(cb) {
  fs.readFile(path.join(process.cwd(), fileName), 'utf8', function (err, data) {
    if (err) throw err;
    cb(data);
  });
}

function parseContent(data) {
  var records = splitIntoRecords(data);
  return makeArray(records);
}

function splitIntoRecords(data) {
  return data.split('\r\n==========');
}

function makeArray(arr) {
  var col = [];

  for (var i = 0; i < arr.length; i++) {

    var record = arr[i];

    // split record into lines (section of a record - title / time / text)
    var lines = splitRecord(record);

    // initialize empty record object
    var singleRecord = {};

    // first line - title and author
    var first = parseLines.firstLine(lines);
    if (first) {
      singleRecord.title = first.title;
      singleRecord.author = first.author;
    }

    //second line - type, location, time
    var second = parseLines.secondLine(lines);
    if (second) {
      singleRecord.time = second.time;
      singleRecord.type = second.type;
      singleRecord.location = second.location;
      singleRecord.page = second.page;
    }

    // third line - content
    var third = parseLines.thirdLine(lines);
    if (third) {
      singleRecord.text = third;
    }

    // push record to collection
    col.push(singleRecord);

  } // end of record iteration
  return col;
}

function splitRecord(record) {
  var line = record.split('\r\n');
  var lines = [];
  for (var j = 0; j < line.length; j++) {
    var l = line[j];
    if (l !== '') {
      lines.push(l.trim());
    }
  }
  return lines;
}

function getTitles (file, cb) {
  var titles = [];
  getObject(file, function (collection) {
    collection.forEach(function(el) {
      if(el.title)
        titles.push(el.title);
    });
    var unique = titles.filter(function(itm, i, titles) {
      return i == titles.indexOf(itm);
    });
    cb(unique, collection);
  });
}

function getBook(collection, title) {
  var book = collection.filter(function (obj) {
    return obj.title === title;
  });
  return book;
}

function getText(book) {
  var text = '';
  for (var i in book) {
    var b = book[i];
    text += b.text + '\n\n----------\n\n';
  }
  return text;
}
