// exports.healthCheck = (req, res) => {
//     res.status(200).send({message: "test"})
// }

const {
    fetchAllTopics, 
    fetchAllEndpoints, 
    fetchArticleById, 
    fetchAllArticles, 
    fetchCommentsByArticleId,
    fetchAllUsers,
    fetchArticlesByTopicQuery
} = require("../model/app.model.js")

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

    fetchArticleById(article_id)
    .then((response) => {
        const commentCount = response[1].rows

        res.status(200).send({response: response[0], commentCount})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    const {topic} = req.query

    if (topic || topic === ""){
        fetchArticlesByTopicQuery(topic)
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch((err) => {
            next(err)
        })

    } else {
        fetchAllArticles()
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch((err) => {
            next(err)
        })
    }
}

exports.getArticleCommentsById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id)
    .then(() => {
        return fetchCommentsByArticleId(article_id)
    })
    .then((response) => {
        res.status(200).send({comments: response})
    })
    .catch((err) => {
            next(err)
    })
}

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
    .then((response) => {
        res.status(200).send({response})
    })
    .catch((err) => {
        next(err)
    })
}

