var path           = require('path');
var optimist       = require('optimist');
var spawn          = require('child_process').spawn;
var fs             = require('fs');
var Clip           = require('../kindle-my-clippings');
var options        = require('../options');
var argv           = optimist.argv;
var currentDir     = path.resolve(process.cwd()) + '/';
var fileName       = argv._[1] || 'My Clippings.txt';

var clip = new Clip(options);

fs.exists(__dirname + '../deploy-settings.js', function(exists) {
  if (exists) {
    var deploySettings = require('../deploy-settings');
  }
});

var commands = {

  html: function(fn) {
    var opts = {
      file    : fileName,
      format  : 'html'
    };

    clip.init(opts, function (data) {
      if (typeof fn === 'function') {
        fn();
      }
    });
  },

  version: function() {
    var pack = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    console.log(pack.version);
  },

  auto: function () {
    var self = this;
    var pr = spawn('cp', ['/Volumes/Kindle/documents/' + fileName, currentDir], {
        env: process.env,
        stdio: 'inherit'
      });
    pr.on('close', function () {
      self.html();
    });
  },

  autodeploy: function () {
    var self = this;
    var pr = spawn('cp', ['/Volumes/Kindle/documents/' + fileName, currentDir], {
        env: process.env,
        stdio: 'inherit'
      });
    pr.on('close', function () {
      self.deploy();
    });
  },

  deploy: function() {
    var user  = deploySettings.user,
        host  = deploySettings.host,
        dir   = deploySettings.dir,
        port  = deploySettings.port,
        file  = deploySettings.file;

    this.html(function () {
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
    }
    else {
      console.log("'" + argv._[0] + "' - no such command");
      return process.exit(0);
    }
  }
  else {
    console.log('You must provide a command!');
    process.exit(0);
  }
};

module.exports.main = main;
