var Clip = require('./kindle-my-clippings');

// kindle-my-clippings data structure & output options
var options = {
  formatDate: true,
  // fields:['title','author','time','text','type','location','page'],
  fields:['title','author','time','text','location'],
  // fields:['title'],
  displayType:['Highlight'],
  outputType: 'file', // html | file
  pretty:true
};

var clip = new Clip(options);
clip.init(file);