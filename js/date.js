String.prototype.strip = function(substr){
  return this.replace(new RegExp(substr, "g"), "")
}

Date.prototype.toICSDateTime = function(){
  var mom = moment(this)
  return mom.format("YYYYMMDDTHHMMss") + "Z";
}

const weekMap = {
  "M" : "MO",
  "T" : "TU",
  "W" : "WE",
  "R" : "TH",
  "F" : "FR",
  "S" : "SA",
  "U" : "SU"
}

// converts a string of single
function weekly(string){
  return Array.from(string).map(function(c){
    return weekMap[c]
  })
}
