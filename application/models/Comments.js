const db = require("../conf/database");
const CommentsModel = {};

CommentsModel.create = (userId, postId, comment) => {
    let baseSql = `INSERT INTO comments (comment, fk_postId, fk_authorId, createdAt) VALUES (?,?,?, now());`
    return db.query(baseSql,[comment,postId,userId])
        .then(([results,fields]) => {
            if(results && results.affectedRows >0){
               return Promise.resolve(results.insertId);
            }else{
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
}

CommentsModel.getCommentsForPost = (postId) => {
    let baseSql = `SELECT u.username, c.comment, c.createdAt, c.id
    FROM comments c
    JOIN users u
    on u.d = c.fk_authorId
    WHERE c.fk_postId=?
    ORDER BY c.createdAt DESC`;
    return db.query(baseSql,[postId])
        .then(([results,fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
}

module.exports = CommentsModel;