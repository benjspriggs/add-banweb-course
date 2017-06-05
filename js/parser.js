var XMLType = {
  TIMES: 0,
  COURSE: 1,
  strings: [
    "This table lists the scheduled meeting times and assigned instructors for this class..",
    "This layout table is used to present the schedule course detail"
  ]
}

function getTableType(summary){
  return Array.from(XMLType.strings)
    .findIndex(function(t){
      return t == summary;
    });
}

function textByClass(name, elem, off = 0){
  return elem.getElementsByClassName(name)[off].textContent;
}

// course table xml parser
class CourseParser {
  constructor(xml){
    this.xml = xml;
  };

  summary(){
    return this.xml.getAttribute("summary");
  }

  getType(){
    return getTableType(this.summary());
  }
}

// course detail
class CourseDetail {
  constructor(xml){
    this.xml = xml;
    this.fullTitle = textByClass("captiontext", this.xml);
    this.table = xml.getElementsByTagName("tbody")[0];

    var rows = Array.from(this.table.getElementsByTagName("tr"));
    this.json = rows.reduce(function(j, row){
      var label = textByClass("ddlabel", row)
  .replace(/:$/, '');
      var text = textByClass("dddefault", row)
      j[label] = text;
      return j;
    }, {});
  };
}

// captures emails in an HTML element
var parseEmailElement = function(td){
  var links = Array.from(td);
  var emails = {};

  // capture emails
  if (links.length != 0)
  {
    // console.dir(links);

    for (var ind in links){
      var target = links[ind].getAttribute("target");
      var href = links[ind].getAttribute("href");
      emails[target] = href;
    }
  }

  return emails
}

