var http = require('http')
  , qs   = require('querystring')
  , fs   = require('fs')
  , url  = require('url')
  , express = require('express')
  , app = express()
  , port = 8080
  

function getData() {

}

var allMovies = JSON.parse(fs.readFileSync('movies.json'))

app.get('/', handleSearch)
app.get('/index.html', handleSearch)
app.get('/style.css', function(req, res) {
  sendFile(res, 'style.css', 'text/css');
})
app.get('/scripts.js', function(req, res) {
  sendFile(res, 'scripts.js', 'text/javascript')
})
app.post('/', handlePost)

app.listen(port);
console.log('listening on ' + port)


function handleSearch(req, res) {
  var contentType = 'text/html'
  let query = req.query
  let filteredMovies = allMovies.filter(function(movie) {
    for (let attr in query) {
      switch (attr) {
        case 'title':
        case 'director':
        case 'cast':
        case 'genre':
        case 'notes':
          if (movie[attr] && !movie[attr].toLowerCase().includes(query[attr].toLowerCase())) {
            return false;
          }
          break
        case 'year':
          if (Number(movie[attr]) !== Number(query[attr]) && Number(query[attr]) !== 0) {
            return false;
          }
          break
      }
    }
    return true;
  })
  // somehow filter movies
  sendIndex(res, filteredMovies)
}

// `handlePost` and is just one possible way of adding add/delete functionality.
// start with it, or come up with another solution...
function handlePost(req, res) {
  postdata = ''
  req.on('data', function(d) {
    postdata += d
  })
  req.on('end', function() {
    var data = qs.parse(postdata)
    console.log(data);
    if (data.action === 'add') {
      allMovies.push(data)
      fs.writeFile('movies.json', JSON.stringify(allMovies, null, 2))
    } else {
      allMovies = allMovies.filter(function(movie) {
        return !(movie.title.toLowerCase() === data.title.toLowerCase() && (Number(movie.year) === Number(data.year)) || isNaN(Number(movie.year)))
      })
      fs.writeFile('movies.json', JSON.stringify(allMovies, null, 2))
    }
    res.redirect('/')
  })
}

function sendIndex(res, movies) {
  var contentType = 'text/html'
    , html = ''

  html = html + '<html>'

  html = html + '<head>'
  html = html + '<link href="https://bootswatch.com/4-alpha/flatly/bootstrap.css" rel="stylesheet" type="text/css">'
  html = html + '<script src="js/scripts.js"></script>'
  html = html + '<link rel="stylesheet" type="text/css" href="/style.css"/>'
  
  html = html + '</head>'

  html = html + '<body>'
  html = html + '<h1>Movie Search!</h1>'

  html = html + '<form action="" method="GET">'
  html = html + '<input class="form-control" type="text" name="title" placeholder="Title (optional)" />'
  html = html + '<input class="form-control" type="text" name="year" placeholder="Year (optional)" />'
  html = html + '<input class="form-control" type="text" name="director" placeholder="Director (optional)" />'
  html = html + '<input class="form-control" type="text" name="cast" placeholder="Cast (optional)" />'
  html = html + '<input class="form-control" type="text" name="genre" placeholder="Genre (optional)" />'
  html = html + '<button class="btn btn-primary" type="submit">Search</button>'
  html = html + '</form>'

  html += '<hr>'

  html += '<div class="row">'

  html += '<div class="add-movie col-md-6">'
  html = html + '<h3>Add a Movie</h3>'
  html = html + '<form action="#" method="POST">'
  html = html + '<input class="form-control" type="text" name="title" placeholder="Title (required)" required />'
  html = html + '<input class="form-control" type="text" name="year" placeholder="Year (required)" required />'
  html = html + '<input class="form-control" type="text" name="director" placeholder="Director (optional)" />'
  html = html + '<input class="form-control" type="text" name="cast" placeholder="Cast (optional)" />'
  html = html + '<input class="form-control" type="text" name="genre" placeholder="Genre (optional)" />'
  html = html + '<button class="btn btn-secondary" type="submit" name="action" value="add">Add</button>'
  html = html + '</form>'
  html += '</div>'

  html += '<div class="remove-movie col-md-6">'
  html = html + '<h3>Remove a Movie</h3>'
  html = html + '<form action="#" method="POST">'
  html = html + '<input class="form-control" type="text" name="title" placeholder="Title (required)" required />'
  html = html + '<input class="form-control" type="text" name="year" placeholder="Year (required)" required />'
  html = html + '<button class="btn btn-secondary" type="submit" name="action" value="remove">Remove</button>'
  html = html + '</form>'
  html += '</div>'

  html += '</div>'

  html += '<table class="table table-striped table-hover table-bordered">'
  html += '<tr><th>Title</th><th>Year</th><th>Director</th><th>Cast</th><th>Genre</th></tr>'
  html = html + movies.map(function(movie) { 
    let movieHTML = ''
    movieHTML += '<tr><td>'+movie.title+'</td><td>'+movie.year+'</td><td>'+movie.director+'</td><td>'+movie.cast+'</td><td>'+movie.genre+'</td></tr>'
    return  movieHTML
  }).join(' ')
  html = html + '</table>'

  html = html + '</body>'
  html = html + '</html>'
  
  res.send(html)
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function(error, content) {
    res.header('Content-type', contentType)
    res.send(content)
  })

}
