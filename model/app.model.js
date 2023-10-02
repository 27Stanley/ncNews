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

