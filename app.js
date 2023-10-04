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


app.all("/*", (req, res, next) => {
    res.status(404).send({message: "path not found"})
})

app.use((err, req, res, next) => {
    if (err.status === 400 && err.message === "invalid id path"){
        res.status(400).send({message: "invalid id path"})
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.status === 404 && err.message === "article not found"){
        res.status(404).send({message: "article not found"})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send('Server Error!');
})


module.exports = app