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

  getInfo(){
    return "{" + this.getType() + "}";
  };
}

// course detail
class CourseDetail {
  constructor(xml){
    this.xml = xml;
    this.fullTitle = this.xml.getElementsByClassName("captiontext")[0].textContent;
  };

  getInfo(){
    return "CourseDetail: " + this.fullTitle;
  }
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
        var links = Array.from(l[e][1].getElementsByTagName("a"));

        this.json[i][headertext] = actualtext;

        // capture emails
        if (links.length != 0)
        {
          // console.dir(links);
          var emails = {}

          for (var ind in links){
            var target = links[ind].getAttribute("target");
            var href = links[ind].getAttribute("href");
            emails[target] = href;
          }

          this.json[i]["Emails"] = emails;
        }
      }
    }
  };

  getInfo(){
    return JSON.stringify(this);
  }
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

  // console.dir(courses)
  // console.log(courses.map(function(x){ return x.getInfo() }))
  console.dir(courses.map(function(c){
    if (c.getType() == XMLType.COURSE)
      return new CourseDetail(c.xml);
    else if (c.getType() == XMLType.TIMES)
      return new CourseSchedule(c.xml);
    else
      return c.getType();
  }))
}
