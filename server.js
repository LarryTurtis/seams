var http = require("http"),
    express = require("express"),
    favicon = require('serve-favicon'),
    path = require('path'),
    upload = require("./lib/fileUpload.js"),
    database = require("./lib/database.js"),
    finDb = require("./lib/finDb.js"),
    auth = require("./lib/authMethods.js"),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    app = express();

app.use(favicon(__dirname + '/app/img/favicon.ico'));

mongoose.connect("mongodb://localhost:27017/test");

app.set('views', path.join(__dirname, '/lib/views'));
app.set('view engine', 'jade');

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(expressSession({
        secret: 'mySecretKey',
        resave: true,
        saveUninitialized: true
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use("/bower_components", express.static("bower_components"))
    .use(flash());

var initPassport = require('./lib/passport/init');
initPassport(passport);

var routes = require('./lib/routes/index')(passport);
app.use('/', routes);
app.use("/", express.static("app"));

/**
 * Product methods.
 */
app.post("/api/dbCreate", auth.shouldDeny, database.createRecord);
app.post("/api/dbDelete", auth.shouldDeny, database.deleteRecord);
app.post("/api/db", auth.shouldAllow, database.getRecord);
app.post("/api/upload", upload.single("avatar"), auth.shouldDeny, function(req, res) {
    res.send(req.file);
});

/**
 * Finance methods
 */
app.post("/api/addAdvertiser", auth.shouldDeny, finDb.addAdvertiser);
app.get("/api/getAllAdvertisers", auth.shouldDeny, finDb.getAllAdvertisers);
app.get("/api/getTransactions", auth.shouldDeny, finDb.getTransactions);
app.post("/api/editAdvertiser", auth.shouldDeny, finDb.editAdvertiser);
app.post("/api/addCategory", auth.shouldDeny, finDb.addCategory);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    var message = {message: "Page Not Found.", error: {status:404}}
        err.status = 404;
    if (app.get('env') === 'development') {
        message = {
            message: err.message,
            error: err
        }
        console.log(err);
    }
    res.render('error', message);
    next(err);
});

var server = http.createServer(app).listen(2323, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Node.js Listening on port: %s:%s", host, port);
});

module.exports = app;
