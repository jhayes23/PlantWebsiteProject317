const express = require('express');
const router = express.Router();
const db = require('../conf/database');
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');
const PostError = require('../helpers/error/PostError');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/images/uploads");
    },
    filename: function (req,file,cb){
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});
let uploader = multer({storage: storage});

router.post('/createPost',uploader.single("uploadFile"), (req,res,next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let desc = req.body.desc;
    let fk_userId = req.session.userId;

    /**
     * //TODO server validation
     * Make sure foreign key, title , and description are not empty.. need defined parameters for insert statement
     * BIND parameters cannot be undefined . CREATE POST 5min mark
     */

    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(()=> {
            let baseSQL = 'INSERT INTO posts (title, description, photopath, thumbnail, createdAt, fk_userid) VALUE (?,?,?,?, now(), ?)';
            return db.execute(baseSQL,[title,desc,fileUploaded,destinationOfThumbnail,fk_userId ]);
        })
        .then(([results,fields]) => {
            if(results && results.affectedRows){
                req.flash('success',"Your post was created successfully");
                res.redirect('/');
            }else{
                throw new PostError('Post could not be created!', '/postImage', 200);
            }
        }).catch((err) => {
            if(err instanceof PostError){
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }else{
                next(err);
            }
    })
})



module.exports = router;
