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

  parsed.forEach(function(x){ x.append() });
}

// page handling
if (valid_page()) {
  handlePage()
}
