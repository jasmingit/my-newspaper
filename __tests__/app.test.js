const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed");
// const { forEach } = require("../db/data/test-data/articles");

beforeEach(() => {
    return seed(data);
  });
  
  afterAll(() => {
    return db.end();
  });  

describe.only ("GET: /api/articles", () => {
    test ("return status 200", () => {
        return request(app).get("/api/articles").expect(200);
    });
    test ("return object with key of articles", () => {
        return request(app).get("/api/articles").expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty('articles')).toBe(true)
        });
    });
});

describe ("GET: /api/topics", () => {
    test ("recieve status 200", () => {
        return request(app).get("/api/topics").expect(200);
    })
    test ("should respond with an object with a key of topics", () => {
        return request(app).get("/api/topics").then(({body}) => {
            expect(body.hasOwnProperty('topics')).toBe(true);
        });
    });
    test ("should return object with slugs and description keys", () => {
        return request(app).get("/api/topics").then(({body}) => {
            expect(Object.keys(body['topics'])).toHaveLength(2);
            expect(Object.keys(body['topics'])).toEqual(['slug', 'description']);
        });
    });
    test ("should return all correct data types", () => {
        return request(app).get("/api/topics").expect(200).then(({body}) => {
            expect(body.topics.slug).toEqual(expect.any(String));
            expect(body.topics.description).toEqual(expect.any(String));
        });
    });
});

describe ("GET: /api/articles/:article_id", () => {
    const articleId2 = {
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: "2020-10-16T05:03:00.000Z",
        votes: 0
      };

    test ("return status 200", () => {
        return request(app).get("/api/articles/2").expect(200);
    });
    test ("return object with key of article with matching article id", () => {
        const articleId = 2;
        
        return request(app).get(`/api/articles/${articleId}`).then(({body}) => {
            const article = body.article
            expect(article.article_id).toEqual(articleId2.article_id);
        });
    });
    test ("object value must contain all the columns as keys", () => {
        const articleId = 2;
        const output = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count'];

        return request(app).get(`/api/articles/${articleId}`).then(({body}) => {
            expect(Object.keys(body.article)).toEqual(output);
            expect(Object.keys(body['article'])).toHaveLength(8);
        });
    });
    test ("all keys/columns return correct data types", () => {
        const articleId = 2;

        return request(app).get(`/api/articles/${articleId}`).then(({body}) => {
            const article = body.article
            expect(article.article_id).toBe(2);
            expect(article.title).toEqual(expect.any(String));
            expect(article.topic).toEqual(expect.any(String));
            expect(article.author).toEqual(expect.any(String));
            expect(article.body).toEqual(expect.any(String));
            expect(article.created_at).toEqual(expect.any(String));
            expect(article.votes).toEqual(expect.any(Number));
            expect(article.comment_count).toEqual(expect.any(Number));
        });
    });

    describe("GET: /api/articles/:article_id - comment_count", () => {
        test ("send status 200", () => {
            return request(app).get("/api/articles/2").expect(200);
        });
        test ("comment count object recieved", () => {
            return request(app).get("/api/articles/2").expect(200)
            .then(({body}) => {
                const article = body.article
                expect(article.hasOwnProperty('comment_count')).toBe(true)
            });
        });
        test ("comment count is correct - article_id = 1", () => {
            return request(app).get("/api/articles/1").expect(200)
            .then(({body}) => {
                const article = body.article
                expect(article.comment_count).toBe(11)
            });
        });
        test ("comment count is correct - article_id = 9", () => {
            return request(app).get("/api/articles/9").expect(200)
            .then(({body}) => {
                const article = body.article
                expect(article.comment_count).toBe(2)
            });
        });
    });
});

describe ("GET: /api/users", () => {
    test ("return status code 200", () => {
        return request(app).get("/api/users").expect(200);
    });
    test ("return object with key of users", () => {
        return request(app).get("/api/users").expect(200)
        .then(({body})=> {
            expect(Object.keys(body)).toEqual(['users']);
        });
    });
    test ("return object with array of users", () => {
        return request(app).get("/api/users").expect(200)
        .then(({body})=> {
            const output = data.userData
            expect(body.users.length).toEqual(4)
            expect(body.users).toEqual(output);
        });
    });
    test ("return object with array of users of correct data types", () => {
        return request(app).get("/api/users").expect(200)
        .then(({body})=> {
            const userArr = body.users
            expect(body.users.length).toEqual(4)
            userArr.forEach((user) => {
                expect(user.username).toEqual(expect.any(String));
                expect(user.name).toEqual(expect.any(String));
                expect(user.avatar_url).toEqual(expect.any(String));
            });
        });
    });
});



////////////////////////// PATCH /////////////////////////////

describe ("PATCH: /api/articles/:article_id", () => {
    test ("returns status 200", () => {
        const updatedVote = { inc_votes : 3 }
        return request(app).patch("/api/articles/2").expect(200)
        .send(updatedVote);

    });
    test ("returns object with key of updatedArticle", () => {
        const updatedVote = { inc_votes : 3 }
        return request(app).patch("/api/articles/2")
        .expect(200)
        .send(updatedVote)
        .then(({body}) => {
            expect(Object.keys(body)).toEqual(['updatedArticle'])
        })
    });
    test ("updates the vote key with newVote (3)", () => {
        const updatedVote = { inc_votes : 3 }
        return request(app).patch("/api/articles/2")
        .send(updatedVote)
        .expect(200)
        .then(({body}) => {
            const updatedArticle = body['updatedArticle']
            expect(updatedArticle.votes).toBe(3);
        });
    });
    test ("updates the vote key with negative newVote (-10)", () => {
        const updatedVote = { inc_votes : -10 }
        return request(app).patch("/api/articles/2")
        .send(updatedVote)
        .expect(200)
        .then(({body}) => {
            const updatedArticle = body['updatedArticle']
            expect(updatedArticle.votes).toBe(-10);
        });
    });
    test ("all keys/columns return correct data types", () => {
        const articleId = 2;
        const updatedVote = { inc_votes : 3 }
        return request(app).get(`/api/articles/${articleId}`).expect(200)
        .send(updatedVote)
        .then(({body}) => {
            const article = body.article
            expect(article.article_id).toBe(2);
            expect(article.title).toEqual(expect.any(String));
            expect(article.topic).toEqual(expect.any(String));
            expect(article.author).toEqual(expect.any(String));
            expect(article.body).toEqual(expect.any(String));
            expect(article.created_at).toEqual(expect.any(String));
            expect(article.votes).toEqual(expect.any(Number));
        });
    });
});

///////////////////////////////////////////////////////

describe ("error handling", () => {
    test ("ALL:returns a 404 with msg when unknown route", () =>{
        return request(app).get("/api/not-a-route").then(({body}) => {
            expect(body.msg).toBe('route not found :(');
        });
    });

    test ("GET: returns 400 when bad request", () => {
        const articleId = "not number"
        return request(app).get(`/api/articles/${articleId}`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request D:<')
        });
    });
    test ("GET: returns 404 when valid but non-existent id", () => {
        return request(app).get("/api/articles/999999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('article not found')
        });
    });
    test ("PATCH: No inc_votes on request body- status 404 with msg", () => {
        const updatedVote = { vote : 3 }
        return request(app).patch("/api/articles/2")
        .expect(400)
        .send(updatedVote)
        .then(({body}) => {
            expect(updatedVote['inc_votes']).toBe(undefined)
            expect(body.msg).toBe('bad request D:<')
        });
    });
    test ("PATCH: inc_votes value is not a Number(string) - status 400 with msg", () => {
        const updatedVote = { inc_votes : 'not a number' };
        return request(app).patch("/api/articles/2")
        .expect(400)
        .send(updatedVote)
        .then(({body}) => {
            expect(body.msg).toBe('bad request D:<')
        });
    })
    test ("PATCH: inc_votes value is not a Number(array) - status 400 with msg", () => {
        const updatedVote = { inc_votes : [1, 2, 3] };
        return request(app).patch("/api/articles/2")
        .expect(400)
        .send(updatedVote)
        .then(({body}) => {

            expect(body.msg).toBe('bad request D:<')
        });
    });
});