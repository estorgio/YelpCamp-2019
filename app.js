const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
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

app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) throw err;
    res.render('index', { campgrounds });
  });
});

app.post('/campgrounds', (req, res) => {
  const { name, image, description } = req.body;
  Campground.create({ name, image, description }, (err) => {
    if (err) throw err;
    res.redirect('/campgrounds');
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.get('/campgrounds/:id', (req, res) => {
  const { id } = req.params;
  Campground
    .findById(id)
    .populate('comments')
    .exec((err, campground) => {
      if (err) throw err;
      console.log('campground show:', campground);
      res.render('show', { campground });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App has been started on port ${port}`));
