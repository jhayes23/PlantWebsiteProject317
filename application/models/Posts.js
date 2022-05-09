const db = require("../conf/database");
const PostModel = {};

PostModel.create = (title, description, photoPath, thumbnail, fk_userId) => {
    let baseSQL = "INSERT INTO posts (title, description, photopath, thumbnail, createdAt, fk_userid) VALUE (?,?,?,?, now(), ?)";
    return db.execute(baseSQL, [title, description, photoPath, thumbnail, fk_userId])
        .then(([results, fields]) => {
            return Promise.resolve(results && results.affectedRows);
        }).catch((err) => Promise.reject(err));
}

PostModel.search = () => {

}

PostModel.getNRecentPosts = (numberOfPost) => {
    let baseSQL = "SELECT id, title, description, thumbnail, createdAt FROM posts ORDER BY createdAt DESC LIMIT 8"
    return db.execute(baseSQL, [numberOfPost])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err))
}
module.exports = PostModel;

