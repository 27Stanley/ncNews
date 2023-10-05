const db = require ("../db/connection.js")

exports.insertComment = (article_id, newComment) => {
    const {username, body} = newComment
    const query = `
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING*;
    `
    return db.query(query, [body, article_id, username])
    .then((result) => {
        return result
    })
}