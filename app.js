const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

// Schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});
const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
//   name: 'Mountain Goat\'s Rest',
//   image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg',
// }, (err, campground) => {
//   if (err) throw err;
//   console.log('Campground has been added');
//   console.log(campground);
// });

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
    res.render('campgrounds', { campgrounds });
  });
});

app.post('/campgrounds', (req, res) => {
  const { name, image } = req.body;
  Campground.create({ name, image }, (err) => {
    if (err) throw err;
    res.redirect('/campgrounds');
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App has been started on port ${port}`));
