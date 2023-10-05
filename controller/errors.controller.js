exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.constraint === "comments_article_id_fkey") {
        res.status(404).send({message: "article not found"})
    }
    if (err.code === "23503") {
        res.status(404).send({message: "username not found"})
    }
    if (err.code === "23502") {
        res.status(400).send({message: "passed information insufficient"})
    }
    next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
    // if (err.status && err.message){
    //     res.status(err.status).send(err.message)
    // }
    if (err.status === 404 && err.message === "article not found"){
        res.status(404).send({message: "article not found"})
    }
    if (err.status === 400 && err.message === "invalid id path"){
        res.status(400).send({message: "invalid id path"})
    }
    next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send('Server Error!');
}