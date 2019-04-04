const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  const campgrounds = [
    {
      name: 'Salmon Creek',
      image: 'https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg',
    },
    {
      name: 'Granite Hill',
      image: 'https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg',
    },
    {
      name: 'Mountain Goat\'s Rest',
      image: 'https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg',
    },
  ];

  res.render('campgrounds', { campgrounds });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App has been started on port ${port}`));
