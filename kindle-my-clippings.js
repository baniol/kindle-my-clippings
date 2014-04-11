var fs        = require('fs'),
  _           = require('underscore'),
  path        = require('path'),
  dateFormat  = require('dateformat'),
  jade        = require('jade'),
  fs          = require('fs'),
  args        = process.argv,
  outputFile  = 'my_clippings.html';

var Clip = function(options) {

  var defaults = {
    formatDate: true,
    fields: ['title', 'author', 'time', 'text', 'type', 'location', 'page'],
    // @todo - toLowerString
    displayType: ['Highlight', 'Note', 'Bookmark'],
    outputType: 'html', // html | file
    pretty: false
  };

  /* merge defaults and options, without modifying defaults */
  this.options = _.extend({}, defaults, options);
};

Clip.prototype.setOutput = function (type) {
  this.options.outputType = type;
};

Clip.prototype.getFileContent = function(file, fn) {
  // @todo - set encoding ?
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      return console.error("Error saving file %s", err);
      // return console.log(err);
    }
    fn(data);
  });
};

Clip.prototype.splitFileIntoRecords = function(data) {
  // @todo check if file is kindle clippings valid format, contains ========== (take from tests ?)
  return data.split('\r\n==========');
};

/**
*
* Block comment
*
**/
Clip.prototype.splitRecord = function(record) {
  var line = record.split('\r\n');
  var lines = [];
  for (var j = 0; j < line.length; j++) {
    var l = line[j];
    if (l !== '') {
      lines.push(l.trim());
    }
  }
  // if(lines.length > 0)
  return lines;
};

Clip.prototype.getFirstLine = function(lines) {
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
};

Clip.prototype.getSecondLine = function(lines) {

  if (lines[1] !== undefined) {

    var t = lines[1].split('|');

    var singleRecord = {};
    for (var y = 0; y < t.length; y++) {
      var el = t[y];

      // @todo - describe time parsing
      if (el.match(/Added on/)) {
        var ti = el.split(',');
        var strTime = this.trim(ti[1]);
        strTime = strTime.replace('Greenwich Mean Time', 'GMT');
        var m = new Date(strTime);
        // @TODO alternative syntax
        var timeFormatted = m.getTime();
        if (this.options.formatDate) {
          timeFormatted = dateFormat(m, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        }
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
        singleRecord.page = this.trim(p.pop());
      }

      // location
      if (el.match(/Loc./)) {
        var l = el.split('Loc.');
        singleRecord.location = this.trim(l.pop());
      }
    }
    return singleRecord;
  } else {
    return false;
  }
};

Clip.prototype.getThirdLine = function(lines) {
  if (lines[2] !== undefined) {
    return this.trim(lines[2]);
  } else {
    return false;
  }
};

Clip.prototype.init = function(sourceFile, targetFile, fn) {
  targetFile = targetFile || outputFile;
  var self = this;
  var fields = {};
  this.options.fields.forEach(function(f) {
    fields[f] = true;
  });
  // redirect output to html file
  this.parse(sourceFile, function(data) {
    var selectTitle = self.getTitles(data);
    // selectTitle.unshift('All titles');
    var modulePath = path.dirname(require.main.filename);
    var jadeFile = path.join(modulePath, '../views/html_file.jade');
    var jadetemplate = jade.compile(fs.readFileSync(jadeFile, 'utf8'), {
      filename: jadeFile,
      pretty: self.options.pretty
    });
    var html = jadetemplate({
      rec: data,
      fields: fields,
      books: selectTitle
    });
    // writing content to a new html file
    fs.writeFile(targetFile, html, function(err) {
      if (err) {
        console.error("Error saving file %s", err);
      }
      console.log('html file saved!');
      if (typeof fn === 'function') {
        fn();
      }
    });
  });

};

Clip.prototype.getTitles = function(col) {
  var titles = [];
  col.forEach(function(el) {
    titles.push(el.title);
  });
  var unique = titles.filter(function(itm, i, titles) {
    return i == titles.indexOf(itm);
  });
  return unique;
};

Clip.prototype.parse = function(file, callback) {

  var self = this;

  this.getFileContent(file, function(data) {
    // split clippings into records
    var arr = self.splitFileIntoRecords(data);

    var col = [];

    // iterate through each record
    for (var i = 0; i < arr.length; i++) {

      var record = arr[i];

      // split record into lines (section of a record - title / time / text)
      var lines = self.splitRecord(record);

      // initialize empty record object
      var singleRecord = {};

      // first line - title and author
      var first = self.getFirstLine(lines);
      if (first) {
        if (self.options.fields.indexOf('title') !== -1)
          singleRecord.title = first.title;
        if (self.options.fields.indexOf('author') !== -1)
          singleRecord.author = first.author;
      }

      // second line - type, location, time
      var second = self.getSecondLine(lines);
      if (second) {
        if (self.options.fields.indexOf('time') !== -1)
          singleRecord.time = second.time;
        if (self.options.fields.indexOf('type') !== -1)
          singleRecord.type = second.type;
        if (self.options.fields.indexOf('location') !== -1)
          singleRecord.location = second.location;
        if (self.options.fields.indexOf('page') !== -1)
          singleRecord.page = second.page;
      }

      // third line - content
      var third = self.getThirdLine(lines);
      if (third) {
        if (self.options.fields.indexOf('text') !== -1)
          singleRecord.text = third;
      }

      // push record to collection
      // @todo - take from options.displayType
      if (self.options.displayType.indexOf(second.type) != -1)
        col.push(singleRecord);

    } // end of record iteration

    if (self.options.outputType == 'file') {
      var strObject = JSON.stringify(col);
      fs.writeFile("output.txt", strObject, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("The file was saved!");
        }
      });
    } 
    else if (self.options.outputType == 'html') {
      callback(col);
    }
    // @TODO code duplication
    else if (self.options.outputType == 'object') {
      var jsonArray = [];
      col.forEach(function(el) {
        jsonArray.push(el);
      });
      console.log(jsonArray);
    } 
    else if (self.options.outputType == 'json') {
      var jsonArray = [];
      col.forEach(function(el) {
        jsonArray.push(el);
      });
      var jsonOutput = JSON.stringify(jsonArray);
      console.log(jsonOutput);
    } 
    else if (self.options.outputType == 'byTitle') {
      var titles = [];
      col.forEach(function(el) {
        titles.push(el.title);
      });
      var unique = titles.filter(function(itm, i, titles) {
        return i == titles.indexOf(itm);
      });

      var output = [];
      unique.forEach(function(t) {
        output[t] = [];
        col.forEach(function(el) {
          if (el.title == t) {
            // removing title property
            delete el.title;
            output[t].push(el);
          }
        });
      });
      console.log(output);
    }
  });
};

Clip.prototype.trim = function(str) {
  str = str.replace(/^\s+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
};

module.exports = Clip;