const { fetchTopics, fetchArticleById, updateArticleById } = require("../model/newpaper");

exports.getTopics = (req, res) => {
    fetchTopics().then((topicArr) => {
        res.status(200).send({topics : topicArr});        
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
        // console.log(article, "<--- updated article")
        res.status(200).send({updatedArticle: article});
    })
    .catch((err) => next(err))
};