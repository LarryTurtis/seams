var http = require("http"),
  express = require("express"),
  path = require('path'),
  upload = require("./lib/fileUpload.js"),
  database = require("./lib/database.js"),
  bodyParser = require("body-parser"),
  passport = require('passport'),
  expressSession = require('express-session'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  app = express();

mongoose.connect("mongodb://localhost:27017/test");

app.set('views', path.join(__dirname, '/lib/views'));
app.set('view engine', 'jade');

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(expressSession({secret: 'mySecretKey'}))
  .use(passport.initialize())
  .use(passport.session())
  .use(flash());

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()) {
    console.log("is authed");
    res.setHeader("Authed", "authed");
    return next();
  }
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}


var initPassport = require('./lib/passport/init');
initPassport(passport);

var routes = require('./lib/routes/index')(passport);
app.use('/', routes);

app.post("/api/dbCreate", isAuthenticated, database.createRecord);
app.post("/api/db", database.getRecord);

app.post("/api/upload", upload.single("avatar"), function(req, res) {
    res.send(req.file);
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});
}

var server = http.createServer(app).listen(2323, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Node.js Listening on port: %s:%s", host, port);
});


module.exports = app;