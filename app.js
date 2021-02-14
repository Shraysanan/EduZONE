var express=require("express"),
    app = express(),
    mongoose=require("mongoose"),   
    bodyParser = require("body-parser"),
    passport = require("passport"),
    // flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user.js");


mongoose.connect("mongodb+srv://hackathon:hackathon@hackathon.skd4q.mongodb.net/hackathon?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify:false});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.use(express.static(__dirname+"/public"));

app.use(require("express-session")({
    secret:"this is secret content",
    resave:false,
    saveUninitialized:false
  }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user; 
    // res.locals.error=req.flash("error");
    // res.locals.success=req.flash("success");
    
    next();   
  });


app.get("/",function(req,res){
    res.render("home");
});



app.get("/music",isLoggedIn,function(req,res){
    res.render("music");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req,res){
    var newUser = ({username: req.body.username});
    console.log("in body");
    User.register(newUser, req.body.password, function(err, user){
      if(err){
          // req.flash("error", err);
          console.log(err);
          return res.render("register");
      }
      passport.authenticate("local")(req,res, function(){
          console.log("registration successfullllllllll");
          console.log(user);
        // req.flash("success", "Welcome to funzone" + newUser);
        res.redirect("/");
      });
    });
  });

app.get("/login", function(req, res){
    res.render("login");
});


app.post("/login",passport.authenticate("local",
{
  successRedirect:"/",
  failureredirect:"/login"
}),function(req,res){
  if(err){
    console.log(err);
  }
  
});

app.get("/logout",function(req,res){
    req.logout();
    //above logout is a function included in passport module
    // req.flash("success","Logged you out!")
    res.redirect("/");
  });

  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    // req.flash("error","You need to be logged in to do that!!!");
    res.redirect("/login");
  }

app.get("/todo",isLoggedIn, function(req, res){
  res.render("todo");
});

app.get("/survey",isLoggedIn, function(req, res){
  res.render("survey");
});


app.get("*",function(req,res){
    res.send("sorry page not found.....");
  });



app.listen(3000,function(){
    console.log("now serving your app");
  });