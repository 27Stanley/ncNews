const db = require ("../db/connection.js")


exports.removeComment = (commentToRemove) => {
    const query = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    `

    return db.query(query, [commentToRemove]).then((deletedComment) => {
        if(deletedComment.rows.length === 0){
            return Promise.reject({
                status: 404,
                message: "comment does not exist"
            })
        }
        return deletedComment.rows[0]
    })
}
