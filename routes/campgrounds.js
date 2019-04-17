const express = require('express');
const moment = require('moment');
const csurf = require('csurf')();
const Campground = require('../models/campground');
const middleware = require('../middleware');

const router = express.Router();

router.get('/', (req, res, next) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      next(err);
      return;
    }
    res.render('campgrounds/index', { campgrounds });
  });
});

router.post('/', middleware.isLoggedIn, csurf, (req, res, next) => {
  const { campground } = req.body;
  const author = {
    // eslint-disable-next-line no-underscore-dangle
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = {
    ...campground,
    author,
  };
  Campground.create(newCampground, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/campgrounds');
  });
});

router.get('/new', middleware.isLoggedIn, csurf, (req, res) => {
  const csrfToken = req.csrfToken();
  res.render('campgrounds/new', { csrfToken });
});

router.get('/:id', csurf, (req, res, next) => {
  const csrfToken = req.csrfToken();
  const { id } = req.params;
  Campground
    .findById(id)
    .populate('comments')
    .exec((err, campground) => {
      if (err) {
        next(err);
        return;
      }
      res.render('campgrounds/show', { csrfToken, campground, moment });
    });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, csurf, (req, res, next) => {
  const csrfToken = req.csrfToken();
  const { id } = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      next(err);
      return;
    }
    res.render('campgrounds/edit', { csrfToken, campground });
  });
});

router.put('/:id', middleware.checkCampgroundOwnership, csurf, (req, res, next) => {
  const { id } = req.params;
  const { campground } = req.body;
  Campground.findByIdAndUpdate(id, campground, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`/campgrounds/${id}`);
  });
});

router.delete('/:id', middleware.checkCampgroundOwnership, csurf, (req, res, next) => {
  const { id } = req.params;
  Campground.findByIdAndDelete(id, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/campgrounds');
  });
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  req.flash('error', err.message);
  res.redirect('back');
});


module.exports = router;
