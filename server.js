var http = require("http"),
  express = require("express"),
  upload = require("./fileUpload.js"),
  database = require("./database.js"),
  bodyParser = require("body-parser"),
  app = express();

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(__dirname));

app.post("/api/dbCreate", database.createRecord);
app.post("/api/db", database.getRecord);

app.post("/api/upload", upload.single("avatar"), function(req, res) {
    res.send(req.file);
});

var server = http.createServer(app).listen(2323, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Node.js Listening on port: %s:%s", host, port);
});
