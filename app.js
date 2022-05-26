const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});


app.listen(3000, function() {
  console.log("Listening on Port 3000!")
});

app.post("/", function(req, res) {
  fs.readFile("./api.json", function(error, data) {
    data = JSON.parse(data);
    let found = false;
    for (let i = 0; i < data.infectedByRegion.length; i++) {
      if (data.infectedByRegion[i].region === req.body.region) {
        found = true;
        res.send("Infected: " + data.infectedByRegion[i].infected);
      }
    }
    if (!found) res.send("Not found");
  });
});

function getApiData() {
  console.log("Sending https request to Covid-API....");
  const url = "";
  https.get(url, function(response) {
    console.log("Received Response! Status Code: " + response.statusCode);
    response.on("data", function(data) {
       data = JSON.parse(data);
       console.log(data);
       fs.writeFile("./api.json", JSON.stringify(data), function(error) {
         if(error) {
           console.log("Error: " + error);
         }
       });
    });
  });
}
