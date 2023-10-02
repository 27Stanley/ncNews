// exports.healthCheck = (req, res) => {
//     res.status(200).send({message: "test"})
// }

const {fetchAllTopics, fetchAllEndpoints} = require("../model/app.model.js")

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