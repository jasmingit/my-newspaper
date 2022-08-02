const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
        .then(({rows: [topics]}) => {
            return topics;
    });
};

exports.fetchArticleById = (articleId) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({ rows : article}) => {
        if(article.length === 0) {
            return Promise.reject({status: 404, msg: 'article not found'});
        };
        return rows[0];
    });
};
    
