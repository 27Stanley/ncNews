const db = require ("../db/connection.js")

exports.patchVotes = (article_id, votesToSum) => {

    const query = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `

    return db.query(query, [votesToSum, article_id])
    .then((result) => {
        if (result.rows.length ===0){
            return Promise.reject({
                status: 404,
                message: "article not found"
            })
        }
        return result.rows
    })

}