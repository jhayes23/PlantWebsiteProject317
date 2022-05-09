var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
var db = require("../conf/database");

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Joshua Hayes" });
});

/* GET login page. */
router.get('/login', (req,res,next)=>{
  res.render('login', { title: 'Login'});
});

/* GET register page. */
router.get('/register',(req,res,next)=>{
  res.render('register', { title: 'Register'});
});
router.use('/post', isLoggedIn);
router.get('/post',(req,res,next)=>{
  res.render('postimage',{title: 'Post An Image'})
});
router.get('/post/:id(\\d+)',(req,res,next) => {
  let baseSQL = "SELECT u.username, p.title, p.description, p.photopath, p.createdAt \
FROM users u \
JOIN posts p \
ON u.id = fk_userid \
  WHERE p.id=?;"

  let postId = req.params.id;
  db.execute(baseSQL,[postId])
      .then(([results, fields]) =>{
        if(results && results.length){
          let post = results[0];
            res.render('imagepost', {currentPost: post});
        }else{
          req.flash('error', 'This is not the post you are looking for!');
          res.redirect('/');
        }
      })
});


router.get('users', (req,res,next)=>{
  res.render('users');
})
module.exports = router;
