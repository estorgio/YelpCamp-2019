const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');

const User = require('./models/user');
const seedDB = require('./seeds');

const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
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

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App has been started on port ${port}`));
