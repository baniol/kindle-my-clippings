'use strict';

var $ = require('jquery')
  , Clip = require('./kindle-my-clippings')
  , jade = require('jade')
  , fs = require('fs');

var options = {
  formatDate: true,
  // fields:['title','author','time','text','type','location','page'],
  fields:['title','author','time','text','location','page'],
  displayType:['Highlight'],
  outputType: 'html'
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
    // redirect output to html file
    var jadetemplate = jade.compile(fs.readFileSync('views/html_file.jade', 'utf8'),{filename:'views/html_file.jade'});
    var html = jadetemplate({rec:data,fields:fields});
    // writing content to a new html file
    fs.writeFile("kindle-my-clippings.html", html, function(err){
        if(err) {
            console.error("Error saving file %s", err);
            process.exit(1);
        }
        console.log('html file saved!');
    });

});