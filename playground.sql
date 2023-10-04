\c nc_news_test

-- SELECT article_id, title, topic, author, created_at, votes, article_img_url 
-- FROM articles
-- ORDER BY created_at DESC;


-- SELECT * FROM comments;
-- SELECT article_id, comment_id FROM comments;


-- DROP TABLE article_comment_count;
-- CREATE TABLE article_comment_count (
--     article_id INT REFERENCES articles (article_id),
--     comment_count INT
-- );

-- INSERT INTO article_comment_count (article_id, comment_count)

SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY created_at DESC;



SELECT * FROM comments WHERE article_id = 1;
SELECT * FROM comments WHERE article_id = 2;

-- SELECT * FROM article_comment_count;

--count the comment_id associated with each article_id
--new column "count" = comment_count