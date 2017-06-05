String.prototype.strip = function(substr){
  return this.replace(new RegExp(substr, "g"), "")
}

Date.prototype.toICSDateTime = function(){
  var mom = moment(this)
  return mom.format("YYYYMMDDTHHMMSSSS") + "Z";
}

const weekMap = {
  "M" : "Mon",
  "T" : "Tue",
  "W" : "Wed",
  "R" : "Thurs",
  "F" : "Fri",
  "S" : "Sat",
  "U" : "Sun"
}

// converts a string of single
function weekly(string){
  return Array.from(string).map(function(c){
    return weekMap[c]
  })
}
