const express = require('express');
const passport = require('passport');
const csurf = require('csurf')();

const User = require('../models/user');
const recaptcha = require('../utils/recaptcha');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing');
});

// AUTH ROUTES
router.get('/register', csurf, (req, res) => {
  const csrfToken = req.csrfToken();
  const recaptchaSiteKey = recaptcha.getSiteKey();

  res.render('register', { recaptchaSiteKey, csrfToken });
});

router.post('/register',
  csurf,
  recaptcha.validate(),
  (req, res, next) => {
    const { username, password } = req.body;
    User.register(new User({ username }), password, (err) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('/register');
        // next(err);
        return;
      }

      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Welcome to YelpCamp, ${req.user.username}!`);
        res.redirect('/campgrounds');
      });
    });
  });

router.get('/login', csurf, (req, res) => {
  const csrfToken = req.csrfToken();
  res.render('login', { csrfToken });
});

router.post('/login', csurf, passport.authenticate('local', {
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

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  req.flash('error', err.message);
  res.redirect('back');
});

module.exports = router;
