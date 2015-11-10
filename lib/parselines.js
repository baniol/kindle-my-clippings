var dateFormat = require('dateformat');

module.exports.firstLine = firstLine;
module.exports.secondLine = secondLine;
module.exports.thirdLine = thirdLine;

function firstLine(lines) {
  if (lines[0] !== undefined) {
    var t = lines[0].split(' (');
    var author = t[1] ? t[1].slice(0, -1) : '';
    return {
      title: t[0],
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
        var ti = el.split(',');
        var strTime = trim(ti[1]);
        strTime = strTime.replace('Greenwich Mean Time', 'GMT');
        var m = new Date(strTime);
        // @TODO alternative syntax
        var timeFormatted = m.getTime();
        timeFormatted = dateFormat(m, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        singleRecord.time = timeFormatted;
      }

      // Examples of type and location
      // * Highlight Loc. 516
      // * Highlight on Page 19
      // * Highlight on Page 3 | Loc. 140  |
      // * Note on Page 11
      // * Bookmark Loc. 241

      // type: Highlight | Bookmark | Note
      if (el.match(/Highlight/)) {
        singleRecord.type = 'Highlight';
      } else if (el.match(/Bookmark/)) {
        singleRecord.type = 'Bookmark';
      } else if (el.match(/Note/)) {
        singleRecord.type = 'Note';
      }

      // on Page (if exists)
      if (el.match(/on Page/)) {
        var p = el.split('on Page');
        singleRecord.page = trim(p.pop());
      }

      // location
      if (el.match(/Loc./)) {
        var l = el.split('Loc.');
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