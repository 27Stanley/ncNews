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

    if (!Number(article_id)){
        return res.status(400).send({message: "invalid id path"})
    }

    fetchArticleById(article_id)
    .then((response) => {
        res.status(200).send({response})
    })
    .catch((err) => {
        if (err) {
            res.status(404).send({message: "article not found"})
        } else{
            next(err)
        }
    })
}