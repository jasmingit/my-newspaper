const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
        .then(({rows: [topics]}) => {
            return topics;
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

// SELECT * FROM articles 
//     WHERE article_id = $1;

// exports.commentCountArticle = (article) => {
//     const articleObj = article
//     const articleId = articleObj.article_id
//     return db.query(
//         `SELECT COUNT(article_id) AS comment_count
//         FROM comments
//         INNER JOIN articles ON articles.article_id = comments.article_id;`)
//         .then(({body}) => {
//             return body
//         });
// };
exports.commentCountArticle = (article) => {
    const articleObj = article
    const articleId = articleObj.article_id
    return db.query(
        `SELECT * FROM comments
        WHERE article_id = $1;`, [articleId])
        .then(({body}) => {
            console.log(body)
        })
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
    
