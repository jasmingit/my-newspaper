// const db = require("./db/connection")
const express = require("express");
const app = express()
const { getTopics } = require("./controller/newspaper")

app.get("/api/topics", getTopics)


module.exports = app
