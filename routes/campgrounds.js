const express = require('express');
const Campground = require('../models/campground');

const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/login');
}

router.get('/', (req, res, next) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      next(err);
      return;
    }
    res.render('campgrounds/index', { campgrounds });
  });
});

router.post('/', isLoggedIn, (req, res, next) => {
  const { name, image, description } = req.body;
  const author = {
    // eslint-disable-next-line no-underscore-dangle
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = {
    name,
    image,
    description,
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

router.get('/new', isLoggedIn, (req, res) => {
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
      res.render('campgrounds/show', { campground });
    });
});

router.get('/:id/edit', (req, res, next) => {
  const { id } = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      next(err);
      return;
    }
    res.render('campgrounds/edit', { campground });
  });
});

router.put('/:id', (req, res, next) => {
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

module.exports = router;
