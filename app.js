const express = require("express")

const {
    getAllTopics, 
    getAllEndpoints, 
    getArticleById, 
    getAllArticles, 
    getArticleCommentsById,
    getAllUsers,

    getArticleByTopicQuery

} = require ("./controller/app.controller.js")

const {
    postComment
} = require ("./controller/app.post.controller.js")

const {
    patchArticleVotes
} = require ("./controller/app.patch.controller.js")

const {
    deleteComment
} = require ("./controller/app.delete.controller.js")


const app = express()

app.use(express.json())

// app.get(`/api/healthCheck`, healthCheck)

app.get(`/api/topics`, getAllTopics)

app.get(`/api`, getAllEndpoints)

app.get(`/api/articles/:article_id`, getArticleById)

app.get(`/api/articles`, getAllArticles)

app.get(`/api/articles/:article_id/comments`, getArticleCommentsById)

app.post(`/api/articles/:article_id/comments`, postComment)

app.patch(`/api/articles/:article_id`, patchArticleVotes)

app.delete(`/api/comments/:comment_id`, deleteComment)

app.get(`/api/users`, getAllUsers)  



app.all("/*", (req, res, next) => {
    res.status(404).send({message: "path not found"})
})


const {
    handlePSQLErrors,
    handleCustomErrors,
    handleServerErrors
} = require("./controller/errors.controller.js")

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)


module.exports = app