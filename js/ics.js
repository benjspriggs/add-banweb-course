function makeEvent(weekly){
  return 'BEGIN:VCALENDAR \n\
VERSION:2.0 \n\
PRODID:' + weekly.prodid + ' \n\
METHOD:PUBLISH \n\
BEGIN:VEVENT \n\
URL:'+ weekly.url +' \n\
UID:'+ weekly.uid +' \n\
SUMMARY:'+ weekly.summary +' \n\
DTSTAMP:'+ weekly.timestamp +' \n\
DTSTART:'+ weekly.dateStart +' \n\
DTEND:'+ weekly.dateEnd +' \n\
RRULE:FREQ=WEEKLY\n\
BYDAY:' + weekly.byDay + '\n\
LOCATION:'+ weekly.location +'  \n\
END:VEVENT \n\
END:VCALENDAR';
}
