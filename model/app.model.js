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

exports.fetchArticleById = (article_id) => {
    if (!Number(article_id)) {
        return Promise.reject({
            status:400
        })
    } else {
        const query = `SELECT * FROM articles WHERE article_id = $1;`
        return db.query(query, [article_id]).then((result) => {
            if (result.rows.length === 0){
                return Promise.reject({
                    status:404
                })
            }
            return(result.rows[0])
        })
    }
}

exports.fetchAllArticles = () => {
    const query = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `

    return db.query(query).then((result) => {
        return result.rows
    })
}