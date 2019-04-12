const express = require('express');
const moment = require('moment');
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

router.post('/', middleware.isLoggedIn, (req, res, next) => {
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

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Campground
    .findById(id)
    .populate('comments')
    .exec((err, campground) => {
      if (err) {
        next(err);
        return;
      }
      res.render('campgrounds/show', { campground, moment });
    });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res, next) => {
  const { id } = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      next(err);
      return;
    }
    res.render('campgrounds/edit', { campground });
  });
});

router.put('/:id', middleware.checkCampgroundOwnership, (req, res, next) => {
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

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res, next) => {
  const { id } = req.params;
  Campground.findByIdAndDelete(id, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/campgrounds');
  });
});

module.exports = router;
