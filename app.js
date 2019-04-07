const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
seedDB();

const app = express();
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

app.get('/campgrounds/:id/comments/new', (req, res, next) => {
  const { id } = req.params;

  Campground.findById(id, (err, campground) => {
    if (err) {
      next(err);
      return;
    }
    res.render('comments/new', { campground });
  });
});

app.post('/campgrounds/:id/comments', (req, res, next) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App has been started on port ${port}`));
