const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const path = require("path");
app.set("viewengine","ejs");
app.set("views",path.join(__dirname,"views"));


const session = require("express-session");
const sessionOptions = {secret:"raf7d5",
    resave:false,
    saveUninitialized:true,
};

const flash = require("connect-flash");



app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    if(req.session.name!="anonymous"){
            req.flash("success","user registered successfully!");
    }
    else{
    req.flash("error","user not registered");
    }
    res.redirect("/hello");
});


app.get("/hello",(req,res)=>{
    res.locals.msg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    res.render("page.ejs",{name:req.session.name})
})

// app.get("/reqcount",(req,res)=>{
//    if(req.session.count){
//     req.session.count++;
//    }
//    else{
//     req.session.count=1;
//    }

//    res.send(`You sent a request ${req.session.count} times`);
// });






















// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.use("/users",users);
// app.use("/posts",posts);

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I am root!");
// });

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie is sent!!");
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.cookies);
//     res.send("verified");
// })
// app.get("/greet",(req,res)=>{
//     let {name="anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);

// });

// app.get("/getcookie",(req,res)=>{
//     res.cookie("greet","hello");
//     res.send("Hi!! I am sending you my goodies (Cookieessss!!!!)");
// });

app.listen(3000, ()=>{
    console.log("server is listening to 3000");
})