const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/login');
}

router.get('/', (req, res) => {
  res.render('landing');
});

// AUTH ROUTES
router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res, next) => {
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

router.get('/login', (req, res) => res.render('login'));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
