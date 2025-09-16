
if(process.env.NODE_ENV !="production"){
   require('dotenv').config();
}

const dbUrl = process.env.ATLASDB_URL;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const MONGO_URL = 'mongodb://127.0.0.1:27017/bookchesuko';
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session =require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: "mysecretcode"
    },
    touchAfter: 24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});



const sessionOptions = {secret:"raf7d5",
    store:store,
    resave:false,
    secret:process.env.SECRET,
    saveUninitialized:true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};




const flash = require("connect-flash");



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/registerUser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);

// })



app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));
app.set("viewengine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',engine);
app.use(express.static(path.join(__dirname,"/public")))
main().then(
    ()=>{
        console.log("Connected to mongo db");
    }
)
.catch(
    (err)=>{
        console.log(err);
    }
);

async function main(){
    await mongoose.connect(dbUrl);
}

app.get("/",(req,res)=>{
    res.redirect("/listings");
});




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// app.get("/",(req,res)=>{
//     res.send("Hi, Ippatikaina Hotel Book Chesuko ra !!!!!");
// });


// app.get("/testls",async (req,res)=>{
//     let samplels = new Listing({
//         title:"Das Villa",
//         description:"In the streets of Hyderabad!!",
//         price:3000,
//         location:"Ramanthapur,Hyderabad",
//         country:"India"
//     });

//     await samplels.save();
//     console.log("Successfully data saved");
//     res.send("Das Villa Book Chesuko Bhai!!!!");
// });



//Reviews 
//post review route




app.use((err,req,res,next)=>{
     console.log("Error URL:", req.originalUrl); // Add this line
   const {statusCode = 500, message = "Something went wrong"} = err;
   res.render("error.ejs",{message}); 
   // res.status(statusCode).send(message);
    }); 

app.listen('3000',()=>{
    console.log("server listening to the port 3000");
});


