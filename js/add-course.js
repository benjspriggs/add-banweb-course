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
    row.classList.add("highlight");
    // var text = document.createTextNode("test")
    // var div = document.createElement("div")
    // div.appendChild(text)
    var button = this.makeButton(this.detail.fullTitle, "click", this.makeIcs())

    var c = Array.from(row.childNodes);
    var x = c.filter(function(elem) { 
      return elem.nodeName.toUpperCase() === button.nodeName.toUpperCase()
    }).forEach(function(elem){
      row.removeChild(elem)
    })

    row.appendChild(button)
    setTimeout(function(){
      row.classList.remove("highlight")
    }, 1000)
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
    var start = parseWeirdDate(some[0]).toICSDateTime();
    var end = parseWeirdDate(some[1]).toICSDateTime();
    var loc = portlandStatePhysicalAddress(this.schedule.json[0]["Where"]);
    var date = new Date().toICSDateTime();
    var days = weekly(this.schedule.json[0]["Days"]);
    return makeEvent({
      summary: this.detail.fullTitle,
      byDay: days,
      timestamp: date,
      dateStart: start,
      dateEnd: end,
      location: loc,
      url: window.location.href,
      prodid: "add-banweb",
      uid: new Date().getTime() + "@add-banweb"
    });
  }

  makeDiv(parent, id){
    var div = document.createElement("div")
    var text = document.createTextNode("something")
    parent.appendChild(div)
  }
}

