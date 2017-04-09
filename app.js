let express = require('express');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

app = express();

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

const user = {
  username: 'admin',
  password: 'pass',
  role: 1,
  id: 1
};

const roleURIMap = {
  1: ['/data']
};

passport.serializeUser((user, cb)=> {
  if(user) {
    cb(null, user.id);
  } else {
    cb(new Error());
  }
});

passport.deserializeUser((id, cb)=> {
  cb(null, user);
});

passport.use('local', new LocalStrategy((username, password, done)=> {
  if(username === user.username) {
    done(null, user);
  } else {
    done(null, false)
  }
}));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.send(403);
}

function isAuthenticated(req, res, next) {
  console.log(roleURIMap[req.user.role], req.url);
  if(roleURIMap[req.user.role].indexOf(req.url) > -1) {
    return next();
  } else {
    res.send(401);
  }
}

app.all('/users', isLoggedIn);

app.get('/users', (req, res)=> {
  res.send(req.user.username);
});

app.post('/login', passport.authenticate('local'), (req, res)=> {
  res.send("Logged!");
});

app.listen(3000, ()=> {
  console.log("Server Started");
});

app.all('/data', isLoggedIn);
app.all('/data', isAuthenticated);
app.get('/data', (req, res)=> {
  res.send('机密数据')
});