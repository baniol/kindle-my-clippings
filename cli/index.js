var path = require('path'),
  optimist = require('optimist'),
  fs = require('fs'),
  Clip = require('../kindle-my-clippings'),
  options = require('../options');

var argv = optimist.argv;

var currentDir = path.resolve(process.cwd()) + '/';

var commands = {

  html: function() {

    var clip = new Clip(options);
    var fileName = argv._[1] || 'My Clippings.txt';
    clip.init(currentDir + fileName);
  },

  json: function () {
    var clip = new Clip(options);
    // @TODO remove file - output to console ?
    var fileName = argv._[1] || 'My Clippings.txt';
    clip.setOutput('json');
    clip.init(currentDir + fileName);
  },

  object: function () {
    // @TODO remove file - output to console ?
    var clip = new Clip(options);
    var fileName = argv._[1] || 'My Clippings.txt';
    clip.setOutput('object');
    clip.init(currentDir + fileName);
  },

  version: function() {
    var pack = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    console.log(pack.version);
  }

};

var main = function() {

  if (argv._[0]) {

    if (typeof commands[argv._[0]] === 'function') {
      commands[argv._[0]]();
    } else {
      console.log("'" + argv._[0] + "' - no such command");
      return process.exit(0);
    }

  } else {

    console.log('You must provide a command!');
    process.exit(0);

  }

};

module.exports.main = main;