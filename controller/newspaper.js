const { fetchTopics, fetchArticleById, updateArticleById, fetchUsers, fetchArticles } = require("../model/newpaper");

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topicArr) => {
        res.status(200).send({topics : topicArr});        
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articlesArr) => {
        // console.log(articlesArr, "<----- articles")
        res.status(200).send({articles : articlesArr});
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
    const articleId = req.params['article_id'];
    fetchArticleById(articleId).then((article)=> {
       res.status(200).send({article: article});
    })
    .catch((err) => next(err));
};

exports.patchArticleById = (req, res, next) => {
    const articleId = req.params['article_id'];
    const newVotes = req.body['inc_votes'];
    if (newVotes === undefined && newVotes !== Number){
        res.status(400).send({ msg: 'bad request D:<' })
    };
    updateArticleById(newVotes, articleId).then((article)=> {
        // console.log(article, "<========= ")
        res.status(200).send({article: article});
    })
    .catch((err) => next(err))
};

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
       res.status(200).send({ users : users}); 
    })
    .catch((err) => next(err));
};