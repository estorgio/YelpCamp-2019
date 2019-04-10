const express = require('express');
const Campground = require('../models/campground');

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

router.post('/', (req, res, next) => {
  const { name, image, description } = req.body;
  Campground.create({ name, image, description }, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/campgrounds');
  });
});

router.get('/new', (req, res) => {
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

module.exports = router;
