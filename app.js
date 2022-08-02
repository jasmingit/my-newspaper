// const db = require("./db/connection")
const express = require("express");
const app = express()
const { getTopics } = require("./controller/newspaper")

app.get("/api/topics", getTopics)

// app.get("/api/articles/:article_id", )

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'route not found! :(' });
  });
  



module.exports = app
