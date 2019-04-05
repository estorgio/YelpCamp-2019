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
  description: String,
});
const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
//   name: 'Granite Hill',
//   image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg',
//   description: 'This is a huge granite hill, no bathrooms, no water. Beautiful granite!',
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
  Campground.findById(id, (err, campground) => {
    if (err) throw err;
    res.render('show', { campground });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App has been started on port ${port}`));
