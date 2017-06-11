var dateFormat = require('dateformat');
var moment = require('moment');

module.exports.firstLine = firstLine;
module.exports.secondLine = secondLine;
module.exports.thirdLine = thirdLine;

function firstLine(lines) {
  if (lines[0] !== undefined) {
    var t = lines[0].split(' (');
    var lastItem = t[1] ? t.pop() : '  ';
    var author = lastItem.slice(0, -1);
    return {
      title: t.join(' ('),
      author: author
    };
  } else {
    return false;
  }
}

function secondLine(lines) {

  if (lines[1] !== undefined) {

    var t = lines[1].split('|');

    var singleRecord = {};
    for (var y = 0; y < t.length; y++) {
      var el = t[y];

      // @todo - describe time parsing
      if (el.match(/Added on/)) {
        var ti = el.split('Added on');
        var strTime = trim(ti[1]);

        // Wednesday, February 3, 2016 8:48:47 AM
        var m = moment(strTime, "dddd, MMMM D, YYYY h:mm:ss A")
        // @TODO alternative syntax
        var timeFormatted = dateFormat(m.valueOf(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
        singleRecord.time = timeFormatted;
      }

      // Examples of type and location
      // * Highlight Loc. 516
      // * Highlight on Page 19
      // * Highlight on Page 3 | Loc. 140  |
      // * Note on Page 11
      // * Bookmark Loc. 241
      // * - Your Highlight on Location 179-185 | Added on Sunday, September 25, 2016 10:56:00 PM

      // type: Highlight | Bookmark | Note
      if (el.match(/Highlight/)) {
        singleRecord.type = 'Highlight';
      } else if (el.match(/Bookmark/)) {
        singleRecord.type = 'Bookmark';
      } else if (el.match(/Note/)) {
        singleRecord.type = 'Note';
      }

      // on Page (if exists)
      if (el.match(/on page/i)) {
        var p = el.split(/on page/i);
        singleRecord.page = trim(p.pop());
      }

      // location
      if (el.match(/Location/)) {
        var l = el.split('Location');
        singleRecord.location = trim(l.pop());
      }
    }
    return singleRecord;
  } else {
    return false;
  }
}

function thirdLine(lines) {
  if (lines[2] !== undefined) {
    return trim(lines[2]);
  } else {
    return false;
  }
}

function trim(str) {
  str = str.replace(/^\s+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
}
