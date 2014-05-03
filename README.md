## Kindle My Clippings.txt parser

### Using as a module

The module parses `My Clippings.txt` file into an object.

The format of the returned object:

```
{
  title: 'What Every Web Developer Should Know About HTTP',
  author: 'OdeToCode Programming Series',
  time: 'Wednesday, April 30th, 2014, 10:50:53 PM',
  location: '1315',
  text: 'is encrypted and hashed to prevent tampering.'
}
```

```javascript
var kindleMyClippings = require('kindle-my-clippings');

var options = {
  file: 'path_to_your_file',
  format: 'object'
};

kindleMyClippings.init(options, function (data) {
  // data is an object with parsed clippings
});
```

You can choose `object` or `json` as format.

### Using as a CLI command

You can parse your My Clippings.txt file into a searchable html file. [Example html output](http://clippings.baniowski.pl).

First you have to install the module globally: `npm install kindle-my-clippings -g`.

Running `kindle-my-clippings html` will produce an index.html file, providing you have a My 'Clippings.txt' file in the current folder.

You can also explicitly specify a file: `kindle-my-clippings html your_file_name`.

