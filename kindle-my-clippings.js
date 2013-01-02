var fs = require('fs'),
	$ = require('jquery'),
	dateFormat = require('dateformat'),
  	jade = require('jade')
  	fs = require('fs')
  	args = process.argv
  	file = 'My Clippings.txt'
  	outputFile = 'my_clippings.html';

// reading optional CLI arguments
// My Clippings.txt file
if(args[2] !== undefined){
  file = args[2];
}

// output file
if(args[3] !== undefined){
  outputFile = args[3];
}


var Clip = function(options){

	var defaults = {
		formatDate: true,
		fields:['title','author','time','text','type','location','page'],
		// @todo - toLowerString
		displayType:['Highlight','Note','Bookmark'],
		outputType: 'html', // html | file
		pretty:false
	};

	/* merge defaults and options, without modifying defaults */
	this.options = $.extend({}, defaults, options);
};

Clip.prototype.getFileContent = function(file,fn){
	// @todo - set encoding ?
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) {
			return console.error("Error saving file %s", err);
			// return console.log(err);
		}
		fn(data);
	});
};

Clip.prototype.splitFileIntoRecords = function(data){
	// @todo check if file is kindle clippings valid format, contains ========== (take from tests ?)
	return data.split('\r\n==========');
};

Clip.prototype.splitRecord = function(record){
	var line = record.split('\r\n');
	var lines = [];
	for(var j=0;j<line.length;j++){
		var l = line[j];
		if(l != ''){
			lines.push(l);
		}
	}
	// if(lines.length > 0)
		return lines;
};

Clip.prototype.getFirstLine = function(lines){
	if(lines[0] !== undefined){
		var t = lines[0].split(' (');
		return {
			title:t[0],
			author: t[1].slice(0, -1)
		}
	}else{
		return false;
	}
};

Clip.prototype.getSecondLine = function(lines){
	
	if(lines[1] !== undefined){

		var t = lines[1].split('|');

		var singleRecord = {};
		for(var y=0;y<t.length;y++){
			var el = t[y];

			// @todo - describe time parsing
			if(el.match(/Added on/)){
				var ti = el.split(',');
				var strTime = $.trim(ti[1]);
				strTime = strTime.replace('Greenwich Mean Time','GMT');
				var m = new Date(strTime);
				var timeFormatted = m.getTime();
				if(this.options.formatDate){
					var timeFormatted = dateFormat(m, "dddd, mmmm dS, yyyy, h:MM:ss TT");
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
			if(el.match(/Highlight/)){
				singleRecord.type = 'Highlight';
			}
			else if(el.match(/Bookmark/)){
				singleRecord.type = 'Bookmark';
			}
			else if(el.match(/Note/)){
				singleRecord.type = 'Note';
			}

			// on Page (if exists)
			if(el.match(/on Page/)){
				var p = el.split('on Page');
				singleRecord.page = $.trim(p.pop());
			}

			// location
			if(el.match(/Loc./)){
				var l = el.split('Loc.');
				singleRecord.location = $.trim(l.pop());
			}
		}
		return  singleRecord;
	}else{
		return false;
	}
};

Clip.prototype.getThirdLine = function(lines){
	if(lines[2] !== undefined){
		return $.trim(lines[2]);
	}else{
		return false;
	}
};

Clip.prototype.init = function(file){
	var $this = this;
	var fields = {};
	this.options.fields.forEach(function(f){
	  fields[f] = true;
	});
    // redirect output to html file
    this.parse(file,function(data){
    	var selectTitle = $this.getTitles(data);
    	// selectTitle.unshift('All titles');
	    var jadetemplate = jade.compile(fs.readFileSync('./views/html_file.jade', 'utf8'),{filename:'./views/html_file.jade',pretty:$this.options.pretty});
	    var html = jadetemplate({
	    	rec:data,
	    	fields:fields,
	    	books:selectTitle
	    });
	    // writing content to a new html file
	    fs.writeFile(outputFile, html, function(err){
	        if(err) {
	            console.error("Error saving file %s", err);
	        }
	        console.log('html file saved!');
	    });
	});

};

Clip.prototype.getTitles = function(col){
	var titles = [];
	col.forEach(function(el){
		titles.push(el.title);
	});
	var unique=titles.filter(function(itm,i,titles){
	    return i==titles.indexOf(itm);
	});
	return unique;
};

Clip.prototype.parse = function(file,callback){

	var $this = this;

	this.getFileContent(file,function(data){
		// split clippings into records
		var arr = $this.splitFileIntoRecords(data);

		var col = [];

		// iterate through each record
		for(var i=0;i<arr.length;i++){

			var record = arr[i];

			// split record into lines
			var lines = $this.splitRecord(record);

			// initialize empty record object
			var singleRecord = {};

			// first line - title and author
			var first = $this.getFirstLine(lines);
			if(first){
				if($.inArray('title',$this.options.fields) != -1)
					singleRecord.title = first.title;
				if($.inArray('author',$this.options.fields) != -1)
					singleRecord.author = first.author;
			}

			// second line - type, location, time
			var second = $this.getSecondLine(lines);
			if(second){
				if($.inArray('time',$this.options.fields) != -1)
					singleRecord.time = second.time;
				if($.inArray('type',$this.options.fields) != -1)
					singleRecord.type = second.type;
				if($.inArray('location',$this.options.fields) != -1)
					singleRecord.location = second.location;
				if($.inArray('page',$this.options.fields) != -1)
					singleRecord.page = second.page;
			}

			// third line - content
			var third = $this.getThirdLine(lines);
			if(third){
				if($.inArray('text',$this.options.fields) != -1)
					singleRecord.text = third;
			}

			// push record to collection
			// @todo - take from options.displayType
			if($.inArray(second.type,$this.options.displayType) != -1)
				col.push(singleRecord);

		} // end of record iteration

		if($this.options.outputType == 'file'){
			var strObject = JSON.stringify(col);
			fs.writeFile("output.txt", strObject, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			});
		}
		else if($this.options.outputType == 'html'){
			callback(col);
		}
		else if($this.options.outputType == 'console'){
			col.forEach(function(el){
				console.log(el);
			});
		}
		else if($this.options.outputType == 'byTitle'){
			var titles = [];
			col.forEach(function(el){
				titles.push(el.title);
			});
			var unique=titles.filter(function(itm,i,titles){
			    return i==titles.indexOf(itm);
			});

			var output = [];
			unique.forEach(function(t){
				output[t] = [];
				col.forEach(function(el){
					if(el.title == t){
						// removing title property
						delete el.title;
						output[t].push(el);
					}
				});
			});

			console.log(output);
		}
	});
}

module.exports = Clip;
