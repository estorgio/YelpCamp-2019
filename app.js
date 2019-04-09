const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');

const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
seedDB();

const app = express();

app.use(expressSession({
  secret: 'jagehaiohnh',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/login');
}

app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res, next) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      next(err);
      return;
    }
    res.render('campgrounds/index', { campgrounds });
  });
});

app.post('/campgrounds', (req, res, next) => {
  const { name, image, description } = req.body;
  Campground.create({ name, image, description }, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/campgrounds');
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', (req, res, next) => {
  const { id } = req.params;
  Campground
    .findById(id)
    .populate('comments')
    .exec((err, campground) => {
      if (err) {
        next(err);
        return;
      }
      res.render('campgrounds/show', { campground });
    });
});

// --------------------------
// COMMENTS ROUTE
// --------------------------

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res, next) => {
  const { id } = req.params;

  Campground.findById(id, (err, campground) => {
    if (err) {
      next(err);
      return;
    }
    res.render('comments/new', { campground });
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;
  Campground.findById(id, (err, campground) => {
    if (err) {
      next(err);
      return;
    }

    Comment.create(comment, (err2, newComment) => {
      if (err2) {
        next(err2);
        return;
      }

      campground.comments.push(newComment);
      campground.save((err3) => {
        if (err3) {
          next(err3);
          return;
        }
        res.redirect(`/campgrounds/${id}`);
      });
    });
  });
});

// AUTH ROUTES
app.get('/register', (req, res) => res.render('register'));

app.post('/register', (req, res, next) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err) => {
    if (err) {
      next(err);
      return;
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

app.get('/login', (req, res) => res.render('login'));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App has been started on port ${port}`));
