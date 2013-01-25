## kindle My Clippings.txt parser to JSON / html

### Usage

Put the source text file, originaly named **My Clippings.txt**, into the module root folder and run:
```javascript
node index.js
```
The above will produce an output file: html or txt (with JSON string), according to settings - default is html.

### Settings

You can change the default settings by editing index.js file in the module root folder:
* **formatDate** : set to false displays timestamp
* **fields** : set of fields displayed in the output file. Available: title, author, time, text, type, location, page
* **displayType** : type of clippings to display. Available: Hightlight, Note, Bookmark (must begin with a capital letter)
* **outputType** : determines the final form of a file: **file** will result in raw txt file, containing JSON string **html** will output a single html file (my_clippings.html), which you can open in a web browser. 
