const express = require("express")
const {
    getAllTopics, 
    getAllEndpoints, 
    getArticleById, 
    getAllArticles, 
    getArticleCommentsById
} = require ("./controller/app.controller.js")

const app = express()

// app.get(`/api/healthCheck`, healthCheck)

app.get(`/api/topics`, getAllTopics)

app.get(`/api`, getAllEndpoints)

app.get(`/api/articles/:article_id`, getArticleById)

app.get(`/api/articles`, getAllArticles)

app.get(`/api/articles/:article_id/comments`, getArticleCommentsById)


const {
    handlePSQLErrors,
    handle404Errors,
    handleServerErrors
} = require("./controller/errors.controller.js")


app.all("/*", (req, res, next) => {
    res.status(404).send({message: "path not found"})
})

app.use(handlePSQLErrors)

app.use(handle404Errors)

app.use(handleServerErrors)


module.exports = app