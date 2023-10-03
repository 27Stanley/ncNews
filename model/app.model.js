const db = require ("../db/connection.js")
const fs = require("fs/promises")

exports.fetchAllTopics = () => {
    const query = `SELECT * FROM topics;`

    return db.query(query).then((result) => {
        return result.rows
    })
}

exports.fetchAllEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((file) => {
        return file
    })
}

exports.fetchArticleById = async (article_id) => {
    const sizeArticlesQuery = `SELECT COUNT(*) FROM articles;`
    const sizeArticles = await db.query(sizeArticlesQuery)
    
    if (article_id > Number(sizeArticles.rows[0].count)){
        return Promise.reject({
            status:404
        })
    }

    const query = `SELECT * FROM articles WHERE article_id = $1;`
    return db.query(query, [article_id]).then((result) => {
        return(result.rows[0])
    })
}