const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

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
  successFlash: 'You have successfully signed in',
  successRedirect: '/campgrounds',
  failureFlash: 'Invalid username or password.',
  failureRedirect: '/login',
}));

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully signed out.');
  res.redirect('/login');
});

module.exports = router;
