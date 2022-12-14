const express = require("express");
const app = express();
const { getTopics, getArticleById, patchArticleById, getUsers, getArticles, getCommentsById, postCommentById } = require("./controller/newspaper");
const { handleCustomErrors, handleServerErrors } = require("./errors");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById)

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postCommentById)

//////////////////////////////////////////
app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'route not found :(' });
});

app.use(handleCustomErrors);
app.use(handleServerErrors);




module.exports = app;

