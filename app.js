var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/user"),
    passsportLocalMongoose  = require("passport-local-mongoose")
    
    
mongoose.connect("mongodb://localhost:27017/auth_demo_app", {useNewUrlParser: true});


var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Sun is shining",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

// =======
// Routes
// =======

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secretz", isLoggedIn, function(req, res){
    res.render("secretz", {currentUser: req.user});
});


// Auth Routes

// show sign up form
app.get("/register",  function(req, res){
    res.render("register");
});

// handling user sign up
app.post("/register", function(req, res){
   req.body.username
   req.body.password
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       }
       passport.authenticate("local")(req, res, function(){
          res.redirect("/secretz"); 
       });
   });
});

// Login Routes
// Render Login Form
app.get("/login", function(req, res){
    res.render("login");
});
// Login logic
// middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secretz",
    failureRedirect: "/login"
}), function(req, res){
    
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
         return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is initiated....");
});