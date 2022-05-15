const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const UserError = require("../helpers/error/UserError");
const {registerValidator, loginValidator} = require('../middleware/validation');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.use("/register", registerValidator);
/* Get form data from register form*/
router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    UserModel.usernameExists(username)
        .then((userDoesNameExist) => {
            if (userDoesNameExist) {
                throw new UserError(
                    "Registration Failed: Username already exists",
                    "/register",
                    200
                );
            } else {
                return UserModel.emailExists(email);
            }
        })
        .then((emailDoesExist) => {
            if (emailDoesExist) {
                throw new UserError(
                    "Registration Failed: Email already exists",
                    "/register",
                    200
                );
            } else {
                return UserModel.create(username, password, email)
            }
        })
        .then((createdUserId) => {
            if (createdUserId < 0) {
                throw new UserError(
                    "Server Error, user could not be created",
                    "/register",
                    500
                );
            } else {
                successPrint("User was created!")
                            req.flash('success','Account has been created!')
                            res.redirect('/login');
            }
        })
        .catch((err) => {
            errorPrint("User could not be made", err);
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        });
})
router.use("/login", loginValidator);
/* Get form data from login form*/
router.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;


    UserModel.authenticate(username,password)
        .then((loggedUserId) => {
            if (loggedUserId > 0) {
                successPrint(`User ${username} is logged in`);
                req.session.username = username;
                req.session.userId = loggedUserId;
                res.locals.logged = true;
                req.flash('success', 'You are now successfully logged in!')
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
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect('/login');
            } else {
                next(err);
            }
        })
})

/* Logout*/
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorPrint("Session could not be destroyed.");
            next(err);
        } else {
            successPrint("Session was destroyed.");
            res.clearCookie('csid');
            res.json({status: "OK", message: "User is logged out"});
        }
    })
});


module.exports = router;
