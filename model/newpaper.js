const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
        .then(({rows: [topics]}) => {
            return topics;
    });
};

exports.fetchArticles = () => {
    return db.query
    (`SELECT articles.*,
    COUNT (comment_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`)
    .then(({rows : articles}) => {
        return articles
    });
};

exports.fetchArticleById = (articleId) => {
    return db.query(`
    SELECT articles.*,
    COUNT (comment_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [articleId])
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
    });
};
    
