var dateFormat = require('dateformat')
var escapeHtml = require('escape-html');


module.exports.convertToHtml = convertToHtml;
module.exports.convertToEvernote = convertToEvernote;

function convertToHtml(json){
  var header = "<html><body>"
  var footer = "</body></html>"

  var body = ""
  body += "<h1>" + json[0].title + "</h1>"
  body += "<h3>" + json[0].author + "</h3>"
  json.forEach(function (item) {
    var parsedDate = new Date(item.timeInMs)
    timeFormatted = dateFormat(parsedDate, "mm/dd/yy, h:MM:ss TT");
    body += "<p>" + item.location + ", " + timeFormatted + "</p>"
    body += "<p>" + escapeHtml(item.text) + "</p>"
  })
  return header + body + footer
}

function convertToEvernote(json){
  var hasContent = false
  var currentTime = dateFormat(new Date(), "UTC:yyyymmdd'T'HHMMss'Z'")

  var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n \
  <!DOCTYPE en-export SYSTEM \"http://xml.evernote.com/pub/evernote-export3.dtd\"> \n \
    <en-export export-date=\"" + currentTime + "\" application=\"Evernote\" > \n \
    <note> \n \
      <title>" + json[0].title + "</title> \n \
      <content><![CDATA[<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?> \n \
      <!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\"> \n \
      <en-note>";
  var footer = "</en-note>]]>\n \
    </content><created>" + currentTime + "</created><updated>" + currentTime + "</updated> \
    <tag>kindle notes</tag> \n \
    <note-attributes><author>jake sparling</author></note-attributes></note> \
    </en-export>"


  var body= ""
  body += "<div><b style=\"font-size: 24px;\">" + json[0].title + "</b><br/></div>"
  body += "<div><span style=\"font-size: 18px;\">" + json[0].author + "</span><br/></div><br/><br/>"

  json.forEach(function (item) {
    var parsedDate = new Date(item.timeInMs)
    timeFormatted = dateFormat(parsedDate, "mm/dd/yy, h:MM:ss TT");
    body += "<div><font color=\"#767676\">" + item.location.replace("- ", "") + " | " + timeFormatted + "</font><p/></div>"
    if(item.type !== 'Bookmark'){
      hasContent = true
      body += "<blockquote style=\"margin: 0 0 0 40px; border: none; padding: 0px;\"><div>" + escapeHtml(item.text) + "</div></blockquote><p/>"
    }
  })

  if(hasContent){
    return header + body + footer
  }
  else {
    return null
  }
}
