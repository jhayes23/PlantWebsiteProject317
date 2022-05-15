const checkUsername = (username) => {
    let usernameChecker = /^\D\w{2,36}$/;
    return usernameChecker.test(username);
}
const checkPassword = (password) => {
    let passwordChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@/$!*^?&+-])[A-Za-z\d@/$!*^?&+-]{7,22}/;
    return passwordChecker.test(password);

}
const checkEmail = (email) => {
    let emailChecker = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailChecker.test(email);
}

const registerValidator = (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirm_password;
    if (!checkUsername(username)) {
        req.flash('error', "Invalid Username.");
        req.session.save(err => {
            res.redirect("/register");
        })
    } else if (!checkEmail(email)) {
        req.flash('error', "Invalid Email.");
        req.session.save(err => {
            res.redirect("/register");
        })
    } else if (!checkPassword(password) && (password !== confirmPassword)) {
        req.flash('error', "Invalid Password or passwords do not match.");
        req.session.save(err => {
            res.redirect("/register");
        })
    } else {
        next();
    }
}

const loginValidator = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    if (!checkUsername(username)) {
        req.flash('error', "Invalid Username.");
        req.session.save(err => {
            res.redirect("/login");
        })
    } else if (!checkPassword(password)) {
        req.flash('error', "Invalid Password.");
        req.session.save(err => {
            res.redirect("/login");
        })
    } else {
        next();
    }
}

module.exports = {registerValidator, loginValidator}