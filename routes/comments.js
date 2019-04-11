const express = require('express');

const Campground = require('../models/campground');
const Comment = require('../models/comment');

const router = express.Router({ mergeParams: true });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/login');
}

router.get('/new', isLoggedIn, (req, res, next) => {
  const { id } = req.params;

  Campground.findById(id, (err, campground) => {
    if (err) {
      next(err);
      return;
    }
    res.render('comments/new', { campground });
  });
});

router.post('/', isLoggedIn, (req, res, next) => {
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

      /* eslint-disable no-underscore-dangle, no-param-reassign */
      newComment.author.id = req.user._id;
      newComment.author.username = req.user.username;
      newComment.save();
      /* eslint-enable no-underscore-dangle, no-param-reassign */

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

router.get('/:commentID/edit', (req, res, next) => {
  const { id, commentID } = req.params;
  Comment.findById(commentID, (err2, comment) => {
    if (err2) {
      next(err2);
      return;
    }
    res.render('comments/edit', { campgroundID: id, comment });
  });
});

router.put('/:commentID', (req, res, next) => {
  const { id, commentID } = req.params;
  const { comment } = req.body;
  Comment.findByIdAndUpdate(commentID, comment, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`/campgrounds/${id}`);
  });
});

router.delete('/:commentID', (req, res, next) => {
  const { id, commentID } = req.params;
  Comment.findByIdAndDelete(commentID, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`/campgrounds/${id}`);
  });
});

module.exports = router;
