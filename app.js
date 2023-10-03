const express = require("express")
const {getAllTopics, getAllEndpoints, getArticleById} = require ("./controller/app.controller.js")

const app = express()

// app.get(`/api/healthCheck`, healthCheck)

app.get(`/api/topics`, getAllTopics)

app.get(`/api`, getAllEndpoints)

app.get(`/api/articles/:article_id`, getArticleById)


app.all("/*", (req, res, next) => {
    res.status(404).send({message: "path not found"})
})

app.use((err, req, res, next) => {
    if (err.status === 400){
        console.log(err)
        res.status(400).send({message: "invalid id path"})
    }
    if (err.status === 404){
        console.log(err)
        res.status(404).send({message: "article not found"})
    }
})

app.use((err, req, res, next) => {
    console.log(err, 'unhandled error here')
    res.status(500).send('Server Error!');
})


module.exports = app