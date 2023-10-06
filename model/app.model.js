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
            status:400,
            message: "invalid id path"
        })
    } else {
        const query = `SELECT * FROM articles WHERE article_id = $1;`

        return db.query(query, [article_id]).then((result) => {
            if (result.rows.length === 0){
                return Promise.reject({
                    status:404,
                    message: "article not found"
                })
            }

            const commentCountQuery = `
            SELECT CAST(COUNT(comment_id) AS INT) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id;
            `

            const commentCountAtArticleId = (db.query(commentCountQuery, [article_id]))

            return Promise.all([result.rows[0],commentCountAtArticleId ])
        })
    }
}

exports.fetchAllArticles = () => {
    const query = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `

    return db.query(query).then((result) => {
        return result.rows
    })
}

exports.fetchCommentsByArticleId = async (article_id) => { 
    const query = `SELECT * FROM comments WHERE article_id = $1;`


    return db.query(query, [article_id]).then((result) => {
        return result.rows
    })
}

exports.fetchAllUsers = () => {
    const query = `
    SELECT * FROM users;
    `

    return db.query(query).then((result) => {
        return result.rows
    })
}

exports.fetchArticlesByTopicQuery = async (topic) => {
    const selectTopicsQuery =`SELECT slug FROM topics`
    let allTopics = await db.query(selectTopicsQuery)

    allTopics = allTopics.rows

    const query = `
    SELECT * FROM articles
    WHERE topic = $1
    `

    const topicStrings = []
    
    allTopics.forEach((slug) => {
        topicStrings.push(slug.slug)
    })

    return db.query(query, [topic]).then((result) => {
        if (result.rows.length === 0 && !topicStrings.includes(topic)){
            return Promise.reject({
                status: 404,
                message: "topic not found"
            })
        }
        return result.rows
    })

}