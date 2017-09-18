var http = require('http')
  , qs   = require('querystring')
  , fs   = require('fs')
  , url  = require('url')
  , express = require('express')
  , app = express()
  , port = 8088
  

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
