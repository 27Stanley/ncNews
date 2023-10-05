const {
    patchVotes
} = require("../model/app.patch.model.js")

const { 
    fetchArticleById
} = require("../model/app.model.js")

exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes : votesToAdd } = req.body

    patchVotes(article_id, votesToAdd)
    .then((result) => {
        res.status(200).send(result[0])
    })
    .catch((err) => {
        next(err)
    })
}

