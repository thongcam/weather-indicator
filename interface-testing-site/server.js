const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

app.use(express.static("public"));
app.use(express.static("semantic"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));



MongoClient.connect(process.env.DB_STRING, (err, client) => {
  if (err) return console.error(err);
  console.log("Connected to Database");
  const db = client.db("interface-testing");
  const responses = db.collection("quotes");
  app.post("/send-response", (req, res) => {
    console.log(req.body);
    res.send("Success");
    responses.insertOne(req.body)
    .then(result => {
        console.log(result)
    }).catch(error => console.error(error));
  });
});
