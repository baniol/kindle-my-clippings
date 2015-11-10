#!/usr/bin/env node

var minimist = require('minimist');
var path = require('path');
var fs = require('fs');

(function () {
  "use strict";

  var argv = minimist(process.argv.slice(2), {
    alias: {h: 'help', o: 'output', f: 'format'}
  });

  if (argv.help) {
    fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
    return;
  }

  var fileName = argv.file || 'My Clippings.txt';

  var clippings = require('../clippings');

  clippings.getTitles(fileName, function (titles, collection) {
    titles.forEach(function (t, index) {
      index++;
      console.log(index + ' - ' + t);
    });
    process.stdin.resume();
    process.stdout.write("Choose a title to display: ");
    process.stdin.once("data", function (data) {
      var bookNumber = data.toString().trim();
      next(titles, collection, bookNumber);
    });
  });

  function next(titles, collection, bookNumber) {
    var chosenTitle = titles[bookNumber - 1];
    var book = clippings.getBook(collection, chosenTitle);
    var text;
    if (argv.format) {
      text = JSON.stringify(book);
    }
    else {
      text = chosenTitle + '\n============\n\n';
      text += clippings.getText(book);
    }
    if (argv.output) {
      fs.writeFileSync(argv.output, text);
    }
    else {
      process.stdout.write(text);
    }
    process.stdin.pause();
  }

})();
