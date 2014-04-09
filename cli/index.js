var path           = require('path'),
    optimist       = require('optimist'),
    spawn          = require('child_process').spawn,
    fs             = require('fs'),
    Clip           = require('../kindle-my-clippings'),
    options        = require('../options');

var argv        = optimist.argv;
var currentDir  = path.resolve(process.cwd()) + '/';
var clip        = new Clip(options);
var fileName    = argv._[1] || 'My Clippings.txt';

fs.exists(__dirname + '../deploy-settings.js', function(exists) { 
  if (exists) { 
    var deploySettings = require('../deploy-settings'); 
  } 
}); 

var commands = {

  html: function() {
    this.exec();
  },

  json: function () {
    clip.setOutput('json');
    this.exec();
  },

  object: function () {
    clip.setOutput('object');
    this.exec();
  },

  exec: function () {
    clip.init(currentDir + fileName);
  },

  version: function() {
    var pack = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    console.log(pack.version);
  },

  deploy: function() {
    var user  = deploySettings.user,
        host  = deploySettings.host,
        dir   = deploySettings.dir,
        port  = deploySettings.port,
        file  = deploySettings.file;

    clip.init(currentDir + fileName, currentDir + file, function () {
      console.log('Sending file ' + file + ' to : ' + user + '@' + host + ' : ' + dir);
      spawn('scp', ['-P ' + port, currentDir + file, user + '@' + host + ':' + dir], {
        env: process.env,
        stdio: 'inherit'
      });
    });
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