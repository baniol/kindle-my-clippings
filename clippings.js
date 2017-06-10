var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var parseLines = require('./lib/parselines')

module.exports.getObject = getObject;
module.exports.getTitles = getTitles;
module.exports.getBook = getBook;
module.exports.getText = getText;

/*
 * Exported only for testing
 */
module.exports._getFileContents = getFileContents;
module.exports._splitIntoRecords = splitIntoRecords;
module.exports._splitRecord = splitRecord;

function getObject(fileNameArray, cb) {
  getFileContents(fileNameArray, function (content) {
    cb(parseContent(content));
  });
}

function getFileContents(fileNameArray, cb) {
  var counter = 0;
  var text = '';
  fileNameArray.forEach(function (file) {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) throw err;
      text = text + '\n' + data;
      counter++;
      if (counter === fileNameArray.length) {
        cb(text);
      }
    });
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

function getTitles(fileNameArray, cb) {
  var titles = [];
  getObject(fileNameArray, function (collection) {
    collection.forEach(function (el) {
      if (el.title)
        titles.push(el.title);
    });
    var unique = titles.filter(function (itm, i, titles) {
      return i == titles.indexOf(itm);
    });
    cb(unique, collection);
  });
}

function getBook(collection, title, startFrom) {
  var lock = !!startFrom;
  var book = collection.filter(function (obj) {
    if (lock && (startFrom === obj.location)) lock = false;
    return !lock && (obj.title === title);
  });
  return book;
}

function getText(book, showLocation) {
  var text = '';
  var locationArray = [];
  const getSingleLocation = x => {
    if (!x.location) return x
    const index = x.location.indexOf('-')
    if (index > -1) {
      return Object.assign({}, x, {
        location: Number(x.location.substr(0, index)),
      })
    }
    return Object.assign({}, x, {
      location: Number(x.location),
    })
  }
  book = _.map(book, getSingleLocation)
  book = _.sortBy(book, 'location')
  for (let i = 0; i < book.length; i++) {
    var b = book[i];
    if (b.location) {
      // Prevent from displaying doubled entries
      if (locationArray.indexOf(b.location) === -1) {
        var location = showLocation ? b.location : '';
        text += '\n----------\t' + location + '\n\n' + b.text + '\n';
      }
      locationArray.push(b.location);
    }
    // No location property - probably pdf with `page` property
    else {
      text += '\n----------\t' + b.page + '\n\n' + b.text + '\n';
    }

  }
  return text;
}
