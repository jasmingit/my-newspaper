const { fetchTopics, fetchArticleById } = require("../model/newpaper");

exports.getTopics = (req, res) => {
    fetchTopics().then((topicArr) => {
        res.status(200).send({topics : topicArr});        
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
    const articleId = req.params['article_id'];
    fetchArticleById(articleId).then((article)=> {
       res.status(200).send({article: article})
    })
    .catch((err) => next(err));
};