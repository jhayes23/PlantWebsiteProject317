const checkUsername = (username) => {
    let usernameChecker = /^\D\w{2,36}$/;
    return usernameChecker.test(username);
}
const checkPassword = (password) => {}
const checkEmail = (email) => {}


const registerValidator = (req,res,next) => {
    let username = req.body.username;
    if(!checkUsername(username)){
        req.flash('error',"Invalid Username");
        req.session.save(err => {
            res.redirect("/register");
        })
    }else{
        next();
    }
}

const loginValidator = (req,res,next) =>{

}
module.exports = {registerValidator, loginValidator}