exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.status === 400 && err.message === "invalid id path"){
        res.status(400).send({message: "invalid id path"})
    }
    next(err)
}

exports.handle404Errors = (err, req, res, next) => {
    if (err.status === 404 && err.message === "article not found"){
        res.status(404).send({message: "article not found"})
    }
    next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send('Server Error!');
}