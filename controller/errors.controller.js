exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.constraint === "comments_article_id_fkey") {
        res.status(404).send({message: "article not found"})
    }
    else if (err.code === "23503") {
        res.status(404).send({message: "username not found"})
    }
    else if (err.code === "23502") {
        res.status(400).send({message: "passed information insufficient"})
    }
    else if (err.code === "22P02") {
        res.status(400).send({message: "comment_id is not a number"})
    } else {
        next(err)
    }
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.message){
    res.status(err.status).send({message: err.message})
    } else {
        next(err)
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send('Server Error!');
}


