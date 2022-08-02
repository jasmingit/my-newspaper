const express = require("express");
const app = express();
const { getTopics, getArticleById, patchArticleById, getUsers } = require("./controller/newspaper");
const { handleCustomErrors, handleServerErrors } = require("./errors");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

//////////////////////////////////////////
app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'route not found :(' });
});

app.use(handleCustomErrors);
app.use(handleServerErrors);




module.exports = app;

