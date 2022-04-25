const express = require('express');
const router = express.Router();
const db = require('../conf/database');
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const UserError = require("../helpers/error/UserError");
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* Get form data from register form*/
router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    //TODO ServerSide Validation not done in video

    db.execute("SELECT * FROM users WHERE username=?", [username]).then(
        ([results, fields]) => {
            if (results && results.length === 0) {
                return db.execute("Select * FROM users WHERE email=?", [email]);
            } else {
                throw new UserError(
                    "Registration Failed: Username already exists",
                    "/register",
                    200
                );
            }
        })
        .then(([results, fields]) => {
            if (results && results.length === 0) {
                return bcrypt.hash(password, 15);
            } else {
                throw new UserError(
                    "Registration Failed: Email already exists",
                    "/register",
                    200
                );
            }
        })
        .then((hashedPassword) => {
            let baseSQL = "INSERT INTO users(username, email, password, created) VALUES (?,?,?,now());"
            return db.execute(baseSQL, [username, email, hashedPassword]);
        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                successPrint("User was created!")
                res.redirect('/login');
            } else {
                throw new UserError(
                    "Server Error, user could not be created",
                    "/register",
                    500
                )
            }
        })
        .catch((err) => {
            errorPrint("User could not be made", err);
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        })
})

/* Get form data from login form*/
router.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    //TODO ServerSide Validation not done in video

    let baseSQL = "SELECT id,username, password FROM users WHERE username=?;"
    let userId;
    db.execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length === 1) {
                let hashedPassword = results[0].password;
                userId = results[0].id;
                return bcrypt.compare(password, hashedPassword);
            } else {
                throw new UserError("Invalid username and/or password!",
                    "/login",
                    200);
            }
        })
        .then((passwordsMatched) => {
            if (passwordsMatched) {
                successPrint(`User ${username} is logged in`);
                req.session.username = username;
                req.session.userId = userId;
                res.locals.logged = true;
                res.redirect("/");
            } else {
                throw new UserError("Invalid username and/or password!",
                    "/login",
                    200);
            }
        })
        .catch((err) => {
            errorPrint("User login failed");
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                res.status(err.getStatus());
                res.redirect('/login');
            } else {
                next(err);
            }
        })
})

/* Logout*/
router.post('/logout',(req,res,next) => {
    req.session.destroy((err) => {
        if(err){
            errorPrint("Session could not be destroyed.");
            next(err);
        }else{
            successPrint("Session was destroyed.");
            res.clearCookie('csid');
            res.json({status:"OK", message:"User is logged out" });
        }
    })
});


module.exports = router;
