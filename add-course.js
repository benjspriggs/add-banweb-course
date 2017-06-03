function includeScript(source, type="text/javascript"){
  var script = document.createElement("script")
  script.setAttribute("src", source)
  // script.setAttribute("type", type)
  document.head.appendChild(script)
}

// add the button css
// includeScript("https://code.jquery.com/jquery-3.2.1.min.js")
// includeScript("http://unicorn-ui.com/buttons/css/buttons.css")
includeScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js")

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

// zip together two arrays
// (courtesy https://gist.github.com/jonschlinkert/2c5e5cd8c3a561616e8572dd95ae15e3)
function zip(a, b){
  var arr = [];
  for (var key in a) arr.push([a[key], b[key]]);
  return arr;
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

    var rowCells = this.rows.map(function(row){
        var cells = Array.from(row.cells)
        return cells.map(function(d, j){
                  return [this.headers.cells[j], cells[j]];
                }, this);
        }, this)
    var somethingElse = rowCells
      .map(function(row){
        return row.reduce(function(prev, cur){
          var headertext = cur[0].textContent;
          var actualtext = cur[1].textContent;

          prev[headertext] = actualtext;

          var links = Array.from(cur[1].getElementsByTagName("a"));
          if (links.length != 0)
            prev["Emails"] = parseEmailElement(links);
          return prev;
        }, {});
      }, []);
    this.json = somethingElse;
  };
}

function doThing(text){
  alert(text)
}

// full course info
class CourseInfo {
  constructor(pair){
    this.detail = pair[0];
    this.schedule = pair[1];
  }

  append(){
    // append a div after the schedule
    var row = this.schedule.rows[0];
    console.log(row.style);
    row.border = "5px solid red";
    // var text = document.createTextNode("test")
    // var div = document.createElement("div")
    // div.appendChild(text)
    row.appendChild(this.makeButton(this.detail.fullTitle, "click", this.makeIcs()))
  }

  makeButton(id, text, thing){
    var button = document.createElement("button")
    button.className += "button button-circle button-tiny"
    button.setAttribute("id", id)
    var s = this.makeIcs()
    button.addEventListener("click", 
      function(){ console.log(s) })
    var text = document.createTextNode(text)
    button.appendChild(text)

    var hideme = document.createElement("div")
    hideme.style.display = "none"
    var guts = document.createTextNode(thing)
    hideme.appendChild(guts)
    button.appendChild(hideme)

    return button;
  }

  makeIcs(){
    var some = this.schedule.json[0]["Date Range"].split(" - ");
    var start = moment(some[0]);
    var end = moment(some[1]);
    console.log(start);
    console.log(end);
    var loc = "location";
    var date = "date entered";
    return 'BEGIN:VCALENDAR \n\
VERSION:2.0 \n\
PRODID:add-banweb \n\
METHOD:PUBLISH \n\
BEGIN:VEVENT \n\
URL:'+ "url" +' \n\
UID:'+ "url" +' \n\
SUMMARY:'+ this.detail.fullTitle +' \n\
DTSTAMP:'+ date +' \n\
DTSTART:'+ start +' \n\
DTEND:'+ end +' \n\
LOCATION:'+ loc +'  \
END:VEVENT \
END:VCALENDAR';
  }

  makeDiv(parent, id){
    var div = document.createEleemnt("div")
    var text = 
    parent.appendChild(div)
  }
}

var valid_page = function(){
  return document.title == "Student Detail Schedule"
}

function handlePage(){

  var courses = Array.from(document.getElementsByClassName("datadisplaytable"));

  // parse all the courses
  courses = courses.map(function(c){
    // c.style.border = "5px solid red";
    return new CourseParser(c);
  })

  var details = courses.filter(function(c){
    return c.getType() == XMLType.COURSE;
  });

  var schedules = courses.filter(function(c){
    return c.getType() == XMLType.TIMES;
  });

  details = details.map(function(c){ return new CourseDetail(c.xml)})
  schedules = schedules.map(function(c){ return new CourseSchedule(c.xml)})

  var together = zip(details, schedules);

  var parsed = together.map(function(pair){
    return new CourseInfo(pair);
  })

  console.dir(parsed);

  parsed.forEach(function(x){ console.log(x.makeIcs()); x.append() });
}

// page handling
if (valid_page()) {
  handlePage()
}
