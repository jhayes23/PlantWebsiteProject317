const express = require('express');
const router = express.Router();
const PostModel = require('../models/Posts');
const db = require('../conf/database');
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');
const PostError = require('../helpers/error/PostError');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/uploads");
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});
let uploader = multer({storage: storage});

router.post('/createPost', uploader.single("uploadFile"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.desc;
    let fk_userId = req.session.userId;

    /**
     * //TODO server validation
     * Make sure foreign key, title , and description are not empty.. need defined parameters for insert statement
     * BIND parameters cannot be undefined . CREATE POST 5min mark
     */

    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            return PostModel.create(
                title,
                description,
                fileUploaded,
                destinationOfThumbnail,
                fk_userId,);
        })
        .then((postWasCreated) => {
            if (postWasCreated) {
                req.flash('success', "Your post was created successfully");
                res.redirect('/');
            } else {
                throw new PostError('Post could not be created!', '/postImage', 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }

    })
})

router.get('/search', async (req, res, next) => {
    try {
        let searchTerm = req.query.search;
        if (!searchTerm) {
            res.send({
                resultsStatus: "info",
                message: "No search term given.",
                results: []
            });
        } else {
            let baseSQL = "SELECT id, title, description, thumbnail, concat_ws('', title, description ) AS haystack \
            FROM posts \
            HAVING haystack like ?; ";
            let sqlReadySearchTerm = "%" + searchTerm + "%";
            let [results, fields] = await db.execute(baseSQL, [sqlReadySearchTerm]);
            if (results && results.length) {
                res.send({
                    resultsStatus: "info",
                    message: `${results.length} results found`,
                    results: results
                });
            } else {
                let [results, fields] = await db.query('SELECT id, title, description, thumbnail, createdAt FROM posts ORDER BY createdAt LIMIT 8', []);
                res.send({
                    resultsStatus: "info",
                    message: "No results were found for your search but here are the 8 most recent posts.",
                    results: results
                });
            }
        }
    }
    catch (err){
        next(err);
    }
});

module.exports = router;
