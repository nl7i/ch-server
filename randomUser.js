const axios = require('axios')

const capitalize = (str) => {
  const stringArr = str.toString().split(' ')
  let capitalized = ''
  for (let i in stringArr) {
    capitalized += ' '+stringArr[i][0].toUpperCase() + stringArr[i].slice(1)
  }
  return(capitalized.slice(1))
}

const getState1 = (state) => {
  if (state == "alabama") {
    return("AL")
  } else if (state == "alaska") {
    return("AK")
  } else if (state == "arizona") {
    return("AR")
  } else if (state == "california") {
    return("CA")
  } else if (state == "olorado") {
    return("CO")
  } else if (state == "connecticut") {
    return("CT")
  } else if (state == "delaware") {
    return("DE")
  } else if (state == "district of columbia") {
    return("DC")
  } else if (state == "florida") {
    return("FL")
  } else if (state == "georgia") {
    return("GA")
  } else if (state == "hawaii") {
    return("HI")
  } else if (state == "idaho") {
    return("ID")
  } else if (state == "illinois") {
    return("IL")
  } else if (state == "indiana") {
    return("IN")
  } else if (state == "iowa") {
    return("IA")
  } else if (state == "kansas") {
    return("KS")
  } else if (state == "kentucky") {
    return("KY")
  } else if (state == "louisiana") {
    return("LA")
  } else if (state == "maine") {
    return("ME")
  } else if (state == "maryland") {
    return("MD")
  } else if (state == "massachusetts") {
    return("MA")
  } else if (state == "michigan") {
    return("MI")
  } else if (state == "minnesota") {
    return("MN")
  } else if (state == "mississippi") {
    return("MS")
  } else if (state == "missouri") {
    return("MO")
  } else if (state == "montana") {
    return("MT")
  } else if (state == "nebraska") {
    return("NE")
  } else if (state == "nevada") {
    return("NV")
  } else if (state == "new hampshire") {
    return("NH")
  } else if (state == "new jersey") {
    return("NJ")
  } else if (state == "new mexico") {
    return("NM")
  } else if (state == "new york") {
    return("LA")
  } else if (state == "north carolina") {
    return("NC")
  } else if (state == "north dakota") {
    return("ND")
  } else if (state == "Ohio") {
    return("OH")
  } else if (state == "oklahoma") {
    return("OK")
  } else if (state == "oregon") {
    return("OR")
  } else if (state == "pennsylvania") {
    return("PA")
  } else if (state == "rhode Island") {
    return("RI")
  } else if (state == "south carolina") {
    return("SC")
  } else if (state == "south dakota") {
    return("SD")
  } else if (state == "tennessee") {
    return("TN")
  } else if (state == "texas") {
    return("TX")
  } else if (state == "utah") {
    return("UT")
  } else if (state == "vermont") {
    return("VT")
  } else if (state == "virginia") {
    return("VA")
  } else if (state == "washington") {
    return("WA")
  } else if (state == "west virginia") {
    return("WV")
  } else if (state == "wisconsin") {
    return("WI")
  } else if (state == "wyoming") {
    return("WY")
  } else {
    return("KY")
  }
}

const main = async () => {
  const response = await axios({
     method: 'GET',
     url: 'https://randomuser.me/api/1.2/?nat=US'
  })
  const result = response.data.results[0]
  
  const title = capitalize(result.name.title)
  const fname = capitalize(result.name.first)
  const lname = capitalize(result.name.last)
  
  const street = capitalize(result.location.street)
  const city = capitalize(result.location.city)
  const state = capitalize(result.location.state)
  const state1 = getState1(result.location.state)
  const postcode = capitalize(result.location.postcode)
  
  const phone = result.phone.match(/\d/g).join("")
  const email = fname.toLowerCase()+phone+'@gmail.com'
  
  return({title, fname, lname, street, city, state, state1, postcode, phone, email})
}
module.exports = main