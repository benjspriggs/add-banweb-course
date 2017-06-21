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

// courtesy
// http://www.satya-weblog.com/2013/11/javascript-select-all-content-html-element.html
function selectText(element){
  var doc = document
    , text = element
    , range, selection
  ;
  if (doc.body.createTextRange) { //ms
    range = doc.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) { //all others
    selection = window.getSelection();
    range = doc.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
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
    // make the div that displays the ICS
    var hideme = this.makeHidemeDiv()

    var revealHideme = function (e) {
      // console.log("something goes here that reveals the hideme div")
      hideme.style.display = ""
    }

    var button = this.makeButton(this.detail.fullTitle, "ICS", revealHideme)

    var c = Array.from(row.childNodes);
    var x = c.filter(function(elem) { 
      return elem.nodeName.toUpperCase() === button.nodeName.toUpperCase()
    }).forEach(function(elem){
      row.removeChild(elem)
    })

    row.appendChild(button)
    row.appendChild(hideme)
    setTimeout(function(){
      row.classList.remove("highlight")
    }, 1000)
  }

  makeButton(id, text, onc){
    return makeButton(id, text, onc, this.makeIcs())
  }

  makeHidemeDiv(){
    return makeHidemeDiv(this.makeIcs())
  }

  parsedEvent(){
    var some = this.schedule.json[0]["Date Range"].split(" - ");
    var start = parseWeirdDate(some[0]).toICSDateTime();
    var end = parseWeirdDate(some[1]).toICSDateTime();
    var loc = portlandStatePhysicalAddress(this.schedule.json[0]["Where"]);
    var date = new Date().toICSDateTime();
    var days = weekly(this.schedule.json[0]["Days"]);
    return {
      summary: this.detail.fullTitle,
      rrule: "FREQ=WEEKLY;" + "BYDAY=" + days,
      dtstamp: date,
      dtstart: start,
      dtend: end,
      location: loc,
      url: window.location.href,
      uid: new Date().getTime() + "@add-banweb"
    };
  }

  makeIcs(){
    return makeEvent(this.parsedEvent());
  }
  // creates a div with an id
  makeDiv(parent, id){
    var div = document.createElement("div")
    var text = document.createTextNode("something")
    parent.appendChild(div)
  }
}

function makeButton(id, text, onc, str){
  var button = document.createElement("button")
  var hideme = document.createElement("div")

  button.className += "button button-circle button-small"
  button.setAttribute("id", id)

  var s = str

  button.onclick = onc
  var text = document.createTextNode(text)
  button.appendChild(text)

  return button;
}

function makeHidemeDiv(str){
  var hideme = document.createElement("div")

  hideme.style.display = "none"
  hideme.appendChild(makeButton("close", "x", function(e){
    // alert("On blur for the hideme div")
    hideme.style.display = "none"
  }, str))

  var pre = document.createElement("pre")
  pre.innerHTML += str
  pre.onclick = function (e){
    selectText(pre)
  }
  hideme.appendChild(pre) 

  return hideme
}
