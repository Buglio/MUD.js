var flash = require('express-flash')
const express =       require("express");
const passport =      require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session =       require('express-session');
const bodyParser =    require('body-parser');
const { QuickDB } =   require('quick.db');
const { makeid } =    require('./backend/util.js');
require('dotenv').config();

// App setup
const app = express();
app.set('view engine', 'ejs');
app.use(flash());
// Middlewares
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);
app.use(session({
  secret: 'mysecretkey',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// View routes
app.get('/', function(req, res) {
  if (req.isAuthenticated()) {
      res.render("index")
  } else {
    res.render("auth")
  }
});
app.get('/error', function(req, res) {
  res.render("error.ejs");
});
app.get('/man', function(req, res) {
  res.render("man.ejs");
});
app.get('/auth', function(req, res) {
  res.render("auth.ejs");
});
app.get('/tos', function(req, res) {
  res.render("tos.ejs");
});
app.use(express.static(__dirname + '/public'));

// === API routes === //
app.get('/auth/user', async function(req, res) {
  let obj = await db.get( "user." + req.user.userId );
  res.send(obj);
})
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.warn(err);
    }
    res.redirect('/');
  });
});
app.post('/auth/register', urlencodedParser, async function(req, res) {
  console.info("REQUESTED REGISTER")
  if (process.env.ALLOW_REGISTER == "true"){
    const { username, email, password, confirmPassword } = req.body;

    // Create default user if it doesn't exist
    //? is this needed
    //! apparently!..?
    const userId = await db.has("user.default");
    if (!userId) {
      // Create default user if it doesn't exist
      const newUser = {
        username: "testman",
        email: "test@test.test",
        password: "default",
        userId: 1
      };
      await db.set("user.default", newUser);
    }

    // Check if username or email already exists
    // Retrieve users from database
    const users = await db.get("user");
    // Check if user exists in database
    const userExists = Object.values(users).find(u => u.username === username);
    if (userExists) {
      return res.send('Username already taken');
    }
    // check if email exists in database
    const emailExists = Object.values(users).find(u => u.email === email);
    if (emailExists) {
      return res.send('Email already taken');
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.send('Passwords do not match');
    }

    // Create new user object
    const newUserId = makeid(10)
    const newUser = {
      username: username,
      email: email,
      password: password,
      userId: newUserId
    };
    
    await db.set("user." + newUserId, newUser);
    console.info("REGISTERING USER")

    // Redirect to homepage
    // log user in HERE
    res.redirect('/');
  }
  else if (process.env.ALLOW_REGISTER == "false"){
    res.redirect('/error');
  }
  else{
    console.error("INTERNAL ERROR");
  }
  
});
app.post('/auth/login', function(req, res, next) {
  console.info('REQUESTED LOGIN');
  next();
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true }), function(req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
      req.session.cookie.expires = false; // Cookie expires at end of session
    }
  res.redirect('/');
});

// app.post("/login", passport.authenticate('local',
//     { failureRedirect: '/login',
//       failureFlash: true }), function(req, res) {
//         if (req.body.remember) {
//           req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
//         } else {
//           req.session.cookie.expires = false; // Cookie expires at end of session
//         }
//       res.redirect('/');
// });

// db setup
const db = new QuickDB();

// Passport setup
passport.use(new LocalStrategy(
  async function(username, password, done) {
    console.info("CREATING USER " + username);
    // Check if user exists in database
    const userId = await db.has("user.default");
    if (!userId) {
      // Create default user if it doesn't exist
      const newUser = {
        username: "testman",
        email: "test@test.test",
        password: "default",
        userId: 1
      };
      await db.set("user.default", newUser);
    }

    // Retrieve user from database
    const users = await db.get("user");
    const user = Object.values(users).find(user => 
      (user.username === username || user.email === username) 
      && user.password === password
    );

    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.userId);
});
passport.deserializeUser(async function(id, done) {
  const users = await db.get("user");
  const user = Object.values(users).find(u => u.userId === id);
  done(null, user);
});

module.exports = {
  app,
  db,
}