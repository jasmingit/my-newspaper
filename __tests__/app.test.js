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

describe ("GET", () => {
    describe ("/api/topics with status 200", () => {
        test ("recieve status 200", () => {
            return request(app).get("/api/topics").expect(200);
        });
        test ("should respond with an object with a key of topics", () => {
            return request(app).get("/api/topics").then(({body}) => {
                expect(body.hasOwnProperty('topics')).toBe(true);
            });
        });
        test ("should return object with slugs and description keys", () => {
            return request(app).get("/api/topics").then(({body}) => {
                expect(Object.keys(body['topics'])).toEqual(['slug', 'description']);
            }); 
        });
    });
});

describe ("error handling", () => {
    test ("return status 404 for unknown routes", () => {
        return request(app)
            .get('/api/not-a-route')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('route not found! :(');
        });
    })
})
