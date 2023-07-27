const express =       require("express");
const passport =      require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session =       require('express-session');
const bodyParser =    require('body-parser');
const { QuickDB } =   require('quick.db');
const { makeid } =    require('./backend/util.js');

// App setup
const app = express();
app.set('view engine', 'ejs');

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
    res.render("index");
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
app.post('/auth/register', urlencodedParser, async function(req, res) {
  console.info("REQUESTED REGISTER")
  const { username, email, password, confirmPassword } = req.body;

  // Create default user if it doesn't exist
  //? is this needed
  //! apparently!..?
  const userId = await db.has("user.default");
  if (!userId) {
    // Create default user if it doesn't exist
    const newUser = {
      username: "default",
      email: "default",
      password: "password123",
      id: 0
    };
    await db.set("user.default", newUser);
  }

  // Check if username or email already exists
  // Retrieve users from database
  const users = await db.get("user");
  // Check if user exists in database
  const userExists = Object.values(users).find(u => u.username === username);
  console.info("USER EXISTS: " + JSON.stringify(userExists))
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
  res.redirect('/');
});

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
        name: "default",
        password: "password123",
        id: 1
      };
      await db.set("user.default", newUser);
    }

    // Retrieve user from database
    const users = await db.get("user");
    const user = Object.values(users).find(user => user.username === username && user.password === password);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function(id, done) {
  const users = await db.get("user");
  const user = Object.values(users).find(u => u.id === id);
  done(null, user);
});

module.exports = {
  app,
  db,
}