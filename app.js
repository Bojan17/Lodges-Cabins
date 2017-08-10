var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var Lodge = require("./models/lodges");
var passport = require("passport");
var Local = require("passport-local");
var Comment = require("./models/comments");
var User =require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index"),
    lodgeRoutes = require("./routes/lodges");

app.locals.moment = require("moment");
mongoose.connect("mongodb://localhost/lodges2",{useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Bojan voli Silu!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(lodgeRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Fishing Lodges Server Has Started!");
});
