const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed");

beforeEach(() => {
    return seed(data);
  });
  
  afterAll(() => {
    return db.end();
  });  

describe ("GET: /api/articles", () => {
    const firstDate = {
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: '2020-11-03T09:12:00.000Z',
        votes: 0,
        comment_count: 2
      }
    const lastDate = {
        article_id: 7,
        title: 'Z',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'I was hungry.',
        created_at: '2020-01-07T14:08:00.000Z',
        votes: 0,
        comment_count: 0
      }

    test ("return status 200", () => {
        return request(app).get("/api/articles").expect(200);
    });
    test ("return object with key of articles", () => {
        return request(app).get("/api/articles").expect(200)
        .then(({body}) => {
            expect(body.hasOwnProperty('articles')).toBe(true)
        });
    });
    test ("array of articles ordered by date(created_at) FIRST DESC", () => {
        return request(app).get("/api/articles").expect(200)
        .then(({body}) => {
            const articles = body.articles
            expect(articles[0]).toEqual(firstDate)
        });
    })
    test ("array of articles ordered by date(created_at) LAST DESC", () => {
        return request(app).get("/api/articles").expect(200)
        .then(({body}) => {
            const articles = body.articles
            const lastindex =  articles.length -1
            expect(articles[lastindex]).toEqual(lastDate)
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

    describe ("GET: /api/articles/:article_id - comment_count", () => {
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

    describe ("GET: /api/articles/:article_id/comments", () => {
        test ("get status 200", () => {
            const articleId = 5
            return request(app).get(`/api/articles/${articleId}/comments`).expect(200);
        });
        test ("return object with key of comments", () => {
            const articleId = 5
            return request(app).get(`/api/articles/${articleId}/comments`)
            .expect(200)
            .then(({body}) => {
                expect(Object.keys(body)).toEqual(['comments']);
            });
        });
        test ("returns comments with the given article_id", () => {
            const articleId = 5
            const commentsWithId5 = [
                {
                  comment_id: 14,
                  body: 'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.',
                  article_id: 5,
                  author: 'icellusedkars',
                  votes: 16,
                  created_at: '2020-06-09T05:00:00.000Z'
                },
                {
                  comment_id: 15,
                  body: "I am 100% sure that we're not completely sure.",
                  article_id: 5,
                  author: 'butter_bridge',
                  votes: 1,
                  created_at: '2020-11-24T00:08:00.000Z'
                }
              ];
            return request(app)
            .get(`/api/articles/${articleId}/comments`)
            .expect(200)
            .then(({body}) => {
                expect(body.comments.length).toBe(2)
                expect(body.comments).toEqual(commentsWithId5);
            });
        });
        test ("returns comments with the given article_id", () => {
            const articleId = 9
            const commentsWithId9 = [
                {
                  comment_id: 1,
                  body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                  article_id: 9,
                  author: 'butter_bridge',
                  votes: 16,
                  created_at: '2020-04-06T12:17:00.000Z'
                },
                {
                  comment_id: 17,
                  body: 'The owls are not what they seem.',
                  article_id: 9,
                  author: 'icellusedkars',
                  votes: 20,
                  created_at: '2020-03-14T17:02:00.000Z'
                }
              ];
            return request(app)
            .get(`/api/articles/${articleId}/comments`)
            .expect(200)
            .then(({body}) => {
                expect(body.comments.length).toBe(2)
                expect(body.comments).toEqual(commentsWithId9);
            });
        });
        test ("comment objects have correct data types", () => {
            const articleId = 9
              return request(app)
              .get(`/api/articles/${articleId}/comments`)
              .expect(200)
              .then(({body}) => {
                const commentArr = body.comments
                commentArr.forEach((comment) => {
                  expect(comment.comment_id).toEqual(expect.any(Number));
                  expect(comment.body).toEqual(expect.any(String));
                  expect(comment.article_id).toEqual(expect.any(Number));
                  expect(comment.author).toEqual(expect.any(String));
                  expect(comment.votes).toEqual(expect.any(Number));
                  expect(comment.created_at).toEqual(expect.any(String));
                });
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
            expect(Object.keys(body)).toEqual(['article'])
        })
    });
    test ("updates the vote key with newVote (3)", () => {
        const updatedVote = { inc_votes : 3 }
        return request(app).patch("/api/articles/2")
        .send(updatedVote)
        .expect(200)
        .then(({body}) => {
            
            const updatedArticle = body.article
            expect(updatedArticle.votes).toBe(3);
        });
    });
    test ("updates the vote key with negative newVote (-10)", () => {
        const updatedVote = { inc_votes : -10 }
        return request(app).patch("/api/articles/2")
        .send(updatedVote)
        .expect(200)
        .then(({body}) => {
            const updatedArticle = body.article
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

////////////////////////// POST ////////////////////////////

describe ("POST: /api/articles/:article_id/comments", () => {
    const newComment = {
        body: "I am a bunch of mumbo jumbo!",
        author: "butter_bridge"
      }
    test ("returns status 201", () => {
        const articleId = 5
        return request(app).post(`/api/articles/${articleId}/comments`)
        .expect(201)
        .send(newComment)
    });
    test ("returns msg with comment added", () => {
        const articleId = 5
        return request(app).post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .then(({body}) => {
            const comments = data.commentData
            const newComment = body['comment'][0]
            console.log(newComment)
            expect(newComment['comment_id']).toBe(19);
            expect(newComment['body']).toBe("I am a bunch of mumbo jumbo!");
            expect(newComment['article_id']).toBe(5);
            expect(newComment['author']).toBe("butter_bridge");
            expect(newComment['votes']).toBe(0);
            expect(newComment['created_at']).toEqual(expect.any(String));
            expect(comments.length).toBe(18);
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
});