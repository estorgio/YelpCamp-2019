const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
  {
    name: "Cloud's Rest",
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  },
  {
    name: 'Canyon Floor',
    image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  },
];

function addNewComment(campground) {
  Comment.create({
    text: 'This a sample comment',
    author: 'John Doe',
  }, (err, comment) => {
    if (err) throw err;
    campground.comments.push(comment);
    campground.save((err2) => {
      if (err2) throw err2;
      console.log(`Comment added: ${comment.text}`);
    });
  });
}

function addNewCampgrounds() {
  data.forEach((seed) => {
    Campground.create(seed, (err, campground) => {
      if (err) throw err;
      console.log(`Campground added: ${campground.name}`);
      addNewComment(campground);
    });
  });
}

function clearDB() {
  return new Promise((resolve, reject) => {
    Campground.deleteMany({}, (err) => {
      if (err) reject(err);
      console.log('Removed campgrounds');

      Comment.deleteMany({}, (err2) => {
        if (err2) reject(err2);
        console.log('Removed comments');
        resolve();
      });
    });
  });
}

async function seedDB() {
  // await clearDB();
  // addNewCampgrounds();
}

module.exports = seedDB;
