"use strict";

function setup(app) {
  var path = require("path");
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");
}

function init(app) {
  var cookieParser = require("cookie-parser");
  var loopbackPassport = require("loopback-component-passport");
  var PassportConfigurator = loopbackPassport.PassportConfigurator;
  var passportConfigurator = new PassportConfigurator(app);
  var config = {};
  var bodyParser = require("body-parser");
  var loopback = require("loopback");
  var session = require("express-session");
  var flash = require("express-flash");
  require('dotenv').config()

  try {
    config = require("./providers.json");
    config.googlelogin.clientID=process.env.clientID
    config.googlelogin.clientSecret=process.env.clientSecret
    console.log(config);
  } catch (err) {
    console.trace(err);
    process.exit(1); // fatal
  }

  app.middleware("parse", bodyParser.json());
  // to support URL-encoded bodies
  app.middleware(
    "parse",
    bodyParser.urlencoded({
      extended: true
    })
  );
  // app.use(loopback.cookieParser('abc'));
  app.middleware(
    "auth",
    loopback.token({
      model: app.models.accessToken
    })
  );
  app.middleware("session:before", cookieParser(app.get("cookieSecret")));
  // app.middleware("session:before", cookieParser("yourSecretKeyForCookies"));

  app.middleware(
    "session",
    session({
      secret: "kitty",
      saveUninitialized: true,
      resave: true
    })
  );
  passportConfigurator.init();

  app.use(flash());
  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  });
  for (var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }
  var ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

  app.get("/home", function(req, res, next) {
    res.render("pages/index", { user: req.user, url: req.url });
  });
  app.get("/auth/account", ensureLoggedIn("/login"), function(req, res, next) {
    res.render("pages/loginProfiles", {
      user: req.user,
      url: req.url
    });
  });

  app.get("/local", function(req, res, next) {
    res.render("pages/local", {
      user: req.user,
      url: req.url
    });
  });

  app.post("/auth/local",(req,res,next)=>{
    var User = app.models.User;
    // console.log(req)
    // return res.redirect("back");
    var newUser = {};
    newUser.email = req.body.username.toLowerCase();
    newUser.username = req.body.username.split('@')[0 ];
    newUser.password = req.body.password;

    User.create(newUser, function(err, user) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      } else {
        
        req.login(user, function(err) {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
          return res.redirect("/auth/account");
        });
      }
    });
  })


  app.get("/ldap", function(req, res, next) {
    res.render("pages/ldap", {
      user: req.user,
      url: req.url
    });
  });

  app.get("/signup", function(req, res, next) {
    res.render("pages/signup", {
      user: req.user,
      url: req.url
    });
  });

  app.post("/signup", function(req, res, next) {
    var User = app.models.user;

    var newUser = {};
    newUser.email = req.body.email.toLowerCase();
    newUser.username = req.body.username.trim();
    newUser.password = req.body.password;

    User.create(newUser, function(err, user) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      } else {
        // Passport exposes a login() function on req (also aliased as logIn())
        // that can be used to establish a login session. This function is
        // primarily used when users sign up, during which req.login() can
        // be invoked to log in the newly registered user.
        req.login(user, function(err) {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
          return res.redirect("/auth/account");
        });
      }
    });
  });

  app.get("/login", function(req, res, next) {
    res.render("pages/login", {
      user: req.user,
      url: req.url
    });
  });

  app.get("/auth/logout", function(req, res, next) {
    req.logout();
    res.redirect("/");
  });
}

var func = {
  setup,
  init
};
module.exports = func;
