#!/usr/bin/env node

var minimist = require('minimist');
var fs = require('fs');

var clippings = require('../clippings');
var conversions = require('../lib/conversions')


var argv = minimist(process.argv.slice(2), {
  alias: {h: 'help', i: 'input', o: 'output', f: 'format', l: 'location', s: 'start', b: 'book'}
});

if (argv.help) {
  return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

var fileName = argv.input || 'My Clippings.txt';
var fileNameArray = fileName.split(',');

clippings.getTitles(fileNameArray, function (titles, collection) {
  if (argv.format && argv.format === 'evernote') {
    titles.forEach(function (t, index) {
      index++;
      next(titles, collection, index);
    });
  }
  else if (argv.book) {
    next(titles, collection, argv.book);
  }
  else {
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
  }
});


function next(titles, collection, bookNumber) {
  var chosenTitle = titles[bookNumber - 1];
  var book = clippings.getBook(collection, chosenTitle, argv.start);
  var useEvernote = argv.format && argv.format === 'evernote'
  var text;

  if (argv.format && argv.format === 'json') {
    text = JSON.stringify(book);
  }
  else if(argv.format && argv.format === 'html') {
    text = conversions.convertToHtml(book)
  }
  else if(useEvernote){
    text = conversions.convertToEvernote(book)
  }
  else {
    text = chosenTitle + '\n============\n\n';
    text += clippings.getText(book, argv.location);
  }
  if (useEvernote) {
    if(text === null){
      console.log("No notes to print for " + book[0].title)
    }
    else {
      var filename = evernoteFilename(book[0].title, book[0].author)
      fs.writeFileSync(filename, text);
    }
  }
  else if (argv.output) {
    fs.writeFileSync(argv.output, text);
  }
  else {
    process.stdout.write(text);
  }
  process.stdin.pause();
}

function evernoteFilename(title, author){
  var newTitle  = title.replace(/[^a-zA-Z0-9]/g,'').substring(0,20);
  var newAuthor = author.replace(/[^a-zA-Z0-9]/g,'').substring(0,20);
  return newTitle + "_" + newAuthor + ".enex";
}
