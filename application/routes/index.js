var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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


router.get('users', (req,res,next)=>{
  res.render('users');
})
module.exports = router;
