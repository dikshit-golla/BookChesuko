const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/userController.js");


router.route("/signup")
.get((req,res)=>{
    res.render("users/signup.ejs");
})
.post(userController.postsignup);


router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(passport.authenticate('local', { failuredRedirect : '/login', failureFlash:true}),userController.postlogin);

router.get("/logout",userController.getlogout);


module.exports = router;

