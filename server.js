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
  .use(express.static(__dirname))
  .use(expressSession({secret: 'mySecretKey'}))
  .use(passport.initialize())
  .use(passport.session())
  .use(flash());

var initPassport = require('./lib/passport/init');
initPassport(passport);

var routes = require('./lib/routes/index')(passport);
app.use('/', routes);

app.post("/api/dbCreate", database.createRecord);
app.post("/api/db", database.getRecord);

app.post("/api/upload", upload.single("avatar"), function(req, res) {
    res.send(req.file);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

var server = http.createServer(app).listen(2323, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Node.js Listening on port: %s:%s", host, port);
});


module.exports = app;