const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const flash = require('connect-flash');

const User = require('./models/user');
const seedDB = require('./seeds');

const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');


// Connect to DB
const connectionString = process.env.DB_STRING
  ? process.env.DB_STRING
  : 'mongodb://localhost:27017/yelp_camp';
mongoose
  .set('useNewUrlParser', true)
  .set('useFindAndModify', false)
  .connect(connectionString)
  .then(() => console.log('Connected to the database'))
  .catch((err) => {
    console.log('Error occured while connecting to the database!');
    console.log(`${err.name}: ${err.message}`);
  });
seedDB();

const app = express();

app.use(expressSession({
  secret: 'jagehaiohnh',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App has been started on port ${port}`));
