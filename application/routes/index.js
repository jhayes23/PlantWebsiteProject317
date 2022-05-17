var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var {getRecentPosts, getPostById,getCommentsByPostId} = require('../middleware/postsmiddleware');
var db = require("../conf/database");

/* GET home page. */
router.get('/', getRecentPosts, function (req, res, next) {
    res.render('index', {title: 'CSC 317 App', username: `${req.session.username}`, name: "Joshua Hayes"});
});

/* GET login page. */
router.get('/login', (req, res, next) => {
    res.render('login', {title: 'Login'});
});

/* GET register page. */
router.get('/register', (req, res, next) => {
    res.render('register', {title: 'Register'});
});
router.get('/post/:id(\\d+)',getPostById,getCommentsByPostId, (req, res, next) => {
    res.render('imagepost', {title: `Post ${req.params.id}`, username: `${req.session.username}`});
});
router.use('/post', isLoggedIn);
router.get('/post', (req, res, next) => {
    res.render('postimage', {title: 'Post An Image',username: `${req.session.username}`})
});


router.get('users', (req, res, next) => {
    res.render('users');
})
module.exports = router;
