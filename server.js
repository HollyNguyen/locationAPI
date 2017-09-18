var http = require('http')
  , qs = require('querystring')
  , fs = require('fs')
  , url = require('url')
  , express = require('express')
  , app = express()
  , port = 8080
  , FILENAME = "/location-data.csv"



var locationData = JSON.parse(fs.readFileSync('location-data.json'))


app.get('/', function (req, res) {
  sendFile(res, 'index.html', 'text/html');
})
app.get('/index.html', function (req, res) {
  sendFile(res, 'index.html', 'text/html');
})
app.get('/style.css', function (req, res) {
  sendFile(res, 'style.css', 'text/css');
})
app.get('/scripts.js', function (req, res) {
  sendFile(res, 'scripts.js', 'text/javascript')
})

app.get('/search', handleSearch)

app.listen(port);
console.log('listening on ' + port)

function handleSearch(req, res) {
  let query = req.query
  let filteredLocations = locationData.filter(function (location) {
    for (let attr in query) {
      switch (attr) {
        case 'STATE_ALPHA':
          if (query[attr] !== location[attr]) {
            return false
          }
          break
        case 'ELEVATION_MIN':
        console.log("data = ", location.ELEV_IN_M)
          if (query["ELEVATION_MIN"] >= location["ELEV_IN_M"]) {
            return false
          }
          break
      }
    }
    return true
  })
  res.header({
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  })
  res.send(filteredLocations)
}


function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function (error, content) {
    res.header('Content-type', contentType)
    res.send(content)
  })

}
