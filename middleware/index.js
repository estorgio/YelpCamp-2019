const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be signed in to perform this action.');
  res.redirect('/login');
};

middleware.checkCampgroundOwnership = (req, res, next) => {
  const { id } = req.params;
  if (!req.isAuthenticated()) {
    res.redirect('back');
    return;
  }

  Campground.findById(id, (err, campground) => {
    if (err) {
      next(err);
      return;
    }
    // eslint-disable-next-line no-underscore-dangle
    if (!campground.author.id.equals(req.user._id)) {
      res.redirect('back');
      return;
    }
    next();
  });
};

middleware.checkCommentOwnership = (req, res, next) => {
  const { commentID } = req.params;

  if (!req.isAuthenticated()) {
    res.redirect('back');
    return;
  }

  Comment.findById(commentID, (err, comment) => {
    if (err) {
      next(err);
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    if (!comment.author.id.equals(req.user._id)) {
      res.redirect('back');
      return;
    }

    next();
  });
};

module.exports = middleware;
