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

// course schedule
class CourseSchedule {
  constructor(xml){
    this.table = Array.from(xml.getElementsByTagName("tr"));
    this.headers = this.table.find(function(r){
      return r.getElementsByClassName("ddheader").length != 0;
    });
    this.rows = this.table.filter(function(r){
      return r.getElementsByClassName("ddheader").length == 0;
    });

    this.json = []

    for (var i = 0; i < this.rows.length; ++i) {
      var cells = Array.from(this.rows[i].cells)
      var l = cells.map(function(d, j){
  return [this.headers.cells[j], cells[j]];
      }, this);
      this.json[i] = {};
      for (var e in l){
  var headertext = l[e][0].textContent;
  var actualtext = l[e][1].textContent;

  this.json[i][headertext] = actualtext;

  var links = Array.from(l[e][1].getElementsByTagName("a"));
  this.json[i]["Emails"] = parseEmailElement(links);
      }
    }
  };
}

var valid_page = function(){
  return document.title == "Student Detail Schedule"
}

// page handling
if (valid_page()) {
  document.body.style.border = "5px solid red";
  var courses = Array.from(document.getElementsByClassName("datadisplaytable"));

  courses = courses.map(function(c){
    return new CourseParser(c);
  })

  console.dir(courses.map(function(c){
    if (c.getType() == XMLType.COURSE)
      return new CourseDetail(c.xml);
    else if (c.getType() == XMLType.TIMES)
      return new CourseSchedule(c.xml);
    else
      return c.getType();
  }))
}
