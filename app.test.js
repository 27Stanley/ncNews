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