function asIcs(type, object){
  var built = [];

  var begin = "BEGIN:" + type.toUpperCase();
  var end = "END:" + type.toUpperCase();

  for (var key in object) {
    built.push(key.toUpperCase() + ":" + object[key]);
  }

  built.push(end);
  built.unshift(begin);
  return built.join("\n");
}

function makeEvent(event){
  return asIcs("VEVENT", event);
//   return 'BEGIN:VCALENDAR \n\
// VERSION:2.0 \n\
// PRODID:' + event.prodid + ' \n\
// METHOD:PUBLISH \n\
// BEGIN:VEVENT \n\
// URL:'+ event.url +' \n\
// UID:'+ event.uid +' \n\
// SUMMARY:'+ event.summary +' \n\
// DTSTAMP:'+ event.timestamp +' \n\
// DTSTART:'+ event.dtstart +' \n\
// DTEND:'+ event.dtend +' \n\
// RRULE:FREQ=event\n\
// BYDAY:' + event.byDay + '\n\
// LOCATION:'+ event.location +'  \n\
// END:VEVENT \n\
// END:VCALENDAR';
}

function makeEvents(events){
  return events.map(function(event){
    return makeEvent(event);
  }).join("\n");
}

function makeCalendar(events){
  return asIcs("VCALENDAR", makeEvents(events));
}

