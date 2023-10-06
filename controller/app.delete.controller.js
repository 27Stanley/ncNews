const {
    removeComment
} = require ("../model/app.delete.model")

exports.deleteComment = (req, res, next) => {
    commentToRemove = req.params.comment_id

    removeComment(commentToRemove)
    .then(() => {
        res.status(204).send({message: "no content"})
    })
    .catch((err) => {
        next(err)
    })
}