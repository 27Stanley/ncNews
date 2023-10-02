// exports.healthCheck = (req, res) => {
//     res.status(200).send({message: "test"})
// }

const {fetchAllTopics, fetchAllEndpoints, fetchArticleById} = require("../model/app.model.js")

exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
    .then((response) => {
        res.status(200).send({topics: response})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllEndpoints = (req, res, next) => {
    fetchAllEndpoints()
    .then((response) => {
        res.status(200).send({response})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params

    if (article_id > 13){
        return res.status(404).send({message: "please provide a valid numerical id path"})
    }
    else if (!Number(article_id)){
        return res.status(400).send({message: "please provide a valid numerical id path"})
    }

    fetchArticleById(article_id)
    .then((response) => {
        res.status(200).send({response})
    })
    .catch((err) => {
        next(err)
    })
}