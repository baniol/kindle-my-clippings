#!/usr/bin/env node

'use strict';

var Clip = require('../kindle-my-clippings');

// kindle-my-clippings data structure & output options
var options = {
  formatDate: true,
  // fields:['title','author','time','text','type','location','page'],
  fields:['title','author','time','text','location'],
  // fields:['title'],
  displayType:['Highlight'],
  outputType: 'html',
  pretty:true
};

var clip = new Clip(options);
clip.init(file);