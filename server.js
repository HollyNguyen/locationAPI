var http = require('http')
  , qs   = require('querystring')
  , fs   = require('fs')
  , url  = require('url')
  , express = require('express')
  , app = express()
  , port = 8080
  , FILENAME = "/location-data.csv"
  


var locationData = JSON.parse(fs.readFileSync('location-data.json'))
  

app.get('/', function(req, res) {
  sendFile(res, 'index.html', 'text/html');
})
app.get('/index.html', function(req, res) {
  sendFile(res, 'index.html', 'text/html');
})
app.get('/style.css', function(req, res) {
  sendFile(res, 'style.css', 'text/css');
})
app.get('/scripts.js', function(req, res) {
  sendFile(res, 'scripts.js', 'text/javascript')
})

app.get('/search', handleSearch)

app.listen(port);
console.log('listening on ' + port)



function getData() {
  // var file = new File(txtFile);
  // file.open("r"); // open file with read access
  // var out = [];
  // while (!file.eof) {
  //   // read each line of text
  //   out.push(file.readln().split(','));
  // }
  // file.close();
  // return JSON.stringify(out);
}
data = getData();

function handleSearch(req, res) {
  let query = req.query
  for (let attr in query) {
    switch (attr) {
      case 'someSearchQuery':
        // Do something
      break
    }
  }
  res.send(/* SOME DATA */)
}


function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function(error, content) {
    res.header('Content-type', contentType)
    res.send(content)
  })

}
