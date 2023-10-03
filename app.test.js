const app = require("./app.js")
const request = require("supertest")
const db = require ("./db/connection.js")
const seed = require("./db/seeds/seed.js")
const data = require ("./db/data/test-data/index.js")

// describe("GET /api/healthCheck", () => {
//     test("returns 200 status code and message", () => {
//         return request(app)
//         .get("/api/healthCheck")
//         .expect(200)
//         .then(({body}) => {
//             expect(body.message).toBe("test")
//         })
//     })
// })


beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})


describe("GET /api/topics", () => {
    test("returns an array of topics each with slug and description of the topic", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            expect(body.topics[0]).toHaveProperty("slug")
            expect(body.topics[1]).toHaveProperty("description")
        })
    })
})


describe("GET /api", () => {
    test("returns a json representation of all the available endpoints of the api", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe("object")
            expect(body).toHaveProperty("response")
        })
    })
})


describe("GET /api/articles/:article_id", () => {
    test("returns an object for the article on that id path", () => {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({body}) => {
            
            const desiredArticle = body.response
            
            expect(typeof desiredArticle).toBe("object")
            expect(Object.keys(desiredArticle)).toHaveLength(8)

            expect(desiredArticle).toEqual(
                expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
            )
        })
    })
    test("returns an error when article id does not exist", () => {
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("article not found")
        })
    })
    test("returns an error for non integer id path", () => {
        return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("invalid id path")
        })
    })
})


describe("GET /api/articles", () => {
    test("returns all articles on this endpoint", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            let resBody = body.response

            resBody.forEach((item) => {
                expect(Object.keys(item)).toHaveLength(8)
            })
            
            resBody.forEach((item) => {
                expect(item).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                )
            })

            expect(resBody).toBeSortedBy("created_at", {descending : true})
        })
    })
})