function parseWeirdDate(date){
  var bits = date.split("-")
  return new Date(bits[0] + " " + bits[1] + ", " + bits[2])
}
