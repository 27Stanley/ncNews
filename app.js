const express = require("express")
const {getAllTopics} = require ("./controller/app.controller.js")

const app = express()

// app.get(`/api/healthCheck`, healthCheck)

app.get(`/api/topics`, getAllTopics)

app.all("/*", (req, res, next) => {
    res.status(404).send({message: "path not found"})
})


module.exports = app