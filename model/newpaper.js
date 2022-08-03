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
        return article[0];
    });
};

exports.updateArticleById = (newVotes, articleId) => {
    return db.query(
       `UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2
        RETURNING *;`, 
        [newVotes, articleId])

    .then(({ rows : article}) => {
        if(article.length === 0) {
            return Promise.reject({status: 404, msg: 'article not found'});
        };
        return article[0]
    });
};

exports.fetchUsers = () => {
    return db.query(
        `SELECT * FROM users;`
    ).then(({rows : users}) => {
        if(users.length === 0) {
            return Promise.reject({status: 404, msg: 'no users found'});
        };
        return users;
    })
}
    
