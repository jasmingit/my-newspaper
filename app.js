// const db = require("./db/connection")
const express = require("express");
const app = express();
const { getTopics, getArticleById } = require("./controller/newspaper");
const { handleCustomErrors, handleServerErrors } = require("./errors")

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'route not found :(' });
});

//////////////////////////////////////////
app.use(handleCustomErrors);
app.use(handleServerErrors);




module.exports = app;
