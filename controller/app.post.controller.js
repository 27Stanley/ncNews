const {
    insertComment
} = require("../model/app.post.model.js")


exports.postComment = (req, res, next) => {

    const {article_id} = req.params
    const commentToAdd = req.body

    insertComment(article_id, commentToAdd).then((postedComment) => {
        res.status(201).send({
            message: "comment posted",
            comment: postedComment.rows[0]
        })
    }).catch((err) => {
        next(err)
    })
}