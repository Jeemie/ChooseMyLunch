// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const yelp = require('yelp-fusion');
const searchRequest = {
  location: 'worcester, ma',
  categories: 'restaurants,food',
  radius: 8000,
  open_now: true,
  limit: 50
};

var address = "";
var radius;


const client = yelp.client(process.env.apiKey);


// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/search", function (request, response){
  address = request.body.address;
  radius = request.body.radius;
});

// send the default array of dreams to the webpage
app.get("/searchAddress", async function (request, response){

  searchRequest.location = address;
  searchRequest.radius = 1600 * radius;

  client.search(searchRequest).then(res => {
    //response = res.jsonBody.businesses;
    response.json(res.jsonBody);
    //const prettyJson = JSON.stringify(allRestaurants[1], null, 4);
    //console.log(prettyJson);
  }).catch(e => {
    console.log(e);
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
