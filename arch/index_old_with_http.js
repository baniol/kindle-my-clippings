'use strict';

var express = require('express')
  , $ = require('jquery')
  , http = require('http')
  , Clip = require('kindle-clippings')
  , app = express()
  , server = http.createServer(app);

// output to http or file
var HTTP_MODE = false,
    TO_FILE = false;

var options = {
  formatDate: true,
  // fields:['title','author','time','text','type','location','page'],
  fields:['title','author','time','text','location','page'],
  displayType:['Highlight'],
  toFile:TO_FILE
};

// @todo - connect with options.fields
var fields = {};
options.fields.forEach(function(f){
  fields[f] = true;
});
// var fields = {title:true,author:true,time:true,text:true,type:false,location:true,page:true};

var clip = new Clip(options);

var clippings;

clip.parse('clippings.txt',function(data){
    if(!HTTP_MODE){
      // redirect output to html file
      var jade = require('jade')
      , fs = require('fs');
      var jadetemplate = jade.compile(fs.readFileSync('views/clippings.jade', 'utf8'),{filename:'views/clippings.jade'});
      var html = jadetemplate({rec:data,fields:fields});
      console.log(html);
    }else{
      clippings = data;
    }
});

if(HTTP_MODE && !TO_FILE){
  app.set('view engine', 'jade');
  app.set('view options', { layout: true });
  app.set('views', __dirname + '/views');

  app.get('/?', function(req, res, next) {
    res.render('clippings',{rec:clippings,fields:fields});
  });

  var port = 8080;
  server.listen(port);
  console.log('Listening on port ' + port);
}
