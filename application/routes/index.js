var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var {getRecentPosts, getPostById} = require('../middleware/postsmiddleware');
var db = require("../conf/database");

/* GET home page. */
router.get('/', getRecentPosts, function (req, res, next) {
    res.render('index', {title: 'CSC 317 App', name: "Joshua Hayes"});
});

/* GET login page. */
router.get('/login', (req, res, next) => {
    res.render('login', {title: 'Login'});
});

/* GET register page. */
router.get('/register', (req, res, next) => {
    res.render('register', {title: 'Register'});
});
router.use('/post', isLoggedIn);
router.get('/post', (req, res, next) => {
    res.render('postimage', {title: 'Post An Image'})
});
router.get('/post/:id(\\d+)',getPostById, (req, res, next) => {
    res.render('imagepost', {title: `Post ${req.params.id}`});
});


router.get('users', (req, res, next) => {
    res.render('users');
})
module.exports = router;
