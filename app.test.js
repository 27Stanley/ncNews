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
            let resBody = body.articles
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

describe("GET /api/articles/:article_id/comments", () => {
    test("400: returns an error when given article id is not a number type", () => {
        return request(app)
        .get("/api/articles/notANumber/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("invalid id path")
        })
    })
    
    test("404: returns an error when given an article id path that does not exist", () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("article not found")    
        })
    })

    test("returns an empty array when the given article id does not have any comments.", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(0)
        })
    })

    test("returns a single object array when the article only has one comment.", () => {
        return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(1)
            expect(body.comments[0]).toEqual(
                expect.objectContaining({
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String)
                })
            )
        })
    })

    test("returns an array of comment objects when the article has multiple comments.", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(11)

            body.comments.forEach((item) => {
                expect(item).toEqual(
                    expect.objectContaining({
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                    })
                )
            })
        })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    test("404: returns error when invalid username used", () => {
        const invalidComment = {
            username: "TEST-USERNAME!!!!!!!",
            body: "TEST-COMMENT-BODY!!!!!!!"
        }

        return request(app)
        .post(`/api/articles/2/comments`)
        .send(invalidComment)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("username not found")
        })
    })

    test("404: returns error when article id not found", () => {
        const validComment = {
            username: "butter_bridge",
            body: "TEST-COMMENT-BODY"
        }

        return request(app)
        .post(`/api/articles/999/comments`)
        .send(validComment)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("article not found") 
        })        
    })

    test("400: returns error when insufficient comment information provided", () => {
        const inValidComment = {
            body: "TEST-COMMENT-BODY"
        }

        return request(app)
        .post(`/api/articles/2/comments`)
        .send(inValidComment)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("passed information insufficient") 
        })        
    })

    test("201: and returns message with comment body", () => {
        const validComment = {
            username: "butter_bridge",
            body: "TEST-COMMENT-BODY"
        }

        return request(app)
        .post(`/api/articles/2/comments`)
        .send(validComment)
        .expect(201)
        .then(({body}) => {

            expect(body.comment).toEqual(expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String)
            }))
        })

    })
})

describe("PATCH /api/articles/:article_id", ()=> {
    test("200: returns article when incremented votes property passed with postive number", () => {
        const votesToIncrement = {
            inc_votes : 1
        }

        return request(app)
        .patch(`/api/articles/2`)
        .send(votesToIncrement)
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe("object")

            expect(body).toEqual(expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            }))
        })
    })

    test("200: returns article when incremented votes property passed with negative number", () => {
        const votesToIncrement = {
            inc_votes : -1
        }

        return request(app)
        .patch(`/api/articles/1`)
        .send(votesToIncrement)
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe("object")

            expect(body).toEqual(expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            }))
        })
    })

    test("400: returns error when insufficient vote increment data", () => {
        const votesToIncrement = { }

        return request(app)
        .patch(`/api/articles/2`)
        .send(votesToIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("passed information insufficient") 
        })        
    })

    test("404: returns error when article id doesnt exist", () => {
        const votesToIncrement = {
            inc_votes : 1
        }

        return request(app)
        .patch(`/api/articles/999`)
        .send(votesToIncrement)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("article not found") 
        })        
    })
})

describe("DELETE /api/comments/:comment_id", ()=> {
    test("204: returns no content when passed existing comment_id", () => {
        return request(app)
        .delete(`/api/comments/18`)
        .expect(204)
    })

    test("400: returns error when string type id is passed", () => {
        return request(app)
        .delete(`/api/comments/NOTANUMBER`)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("comment_id is not a number")
        })
    })

    test("404: returns error when comment_id does not exist", () => {
        return request(app)
        .delete(`/api/comments/999`)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("comment does not exist")
        })
    })

})

describe("GET /api/users", () => {
    test("returns an array of users with properties username, name and avatar url", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            for(const user of body.response){
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            }
        })
    })
})

describe("GET /api/users", () => {
    test("returns an array of users with properties username, name and avatar url", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            for(const user of body.response){
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            }
        })
    })
})

describe("GET /api/articles?topic=", () => {
    test("returns the articles with topic specified by the path query", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            const resBody = body.articles
            expect(typeof body).toBe("object")

            resBody.forEach((item) => {
                expect(Object.keys(item)).toHaveLength(8)
                expect(item).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                    })
                )
            })

        })
    })

    test("404: returns error when topic query provided does not exist", () => {
        return request(app)
        .get("/api/articles?topic=notATopic")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("topic not found")
        })
    })

    test("404: returns error when topic query provided is empty", () => {
        return request(app)
        .get("/api/articles?topic=")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("topic not found")
        })
    })

    test("200: returns empty array when topic exists, but no article under that topic", () => {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual([])
        })
    })
})
