// exports.healthCheck = (req, res) => {
//     res.status(200).send({message: "test"})
// }

const {fetchAllTopics} = require("../model/app.model.js")

exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
    .then((response) => {
        res.status(200).send({topics: response})
    })
}