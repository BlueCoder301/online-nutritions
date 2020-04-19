'use strict';
require('dotenv').config();
const pg = require('pg');
const express = require('express');
const PORT = process.env.PORT || 3030;
const app = express();
const methodOverride = require('method-override');
const superagent = require('superagent');
app.use(express.static('./public'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

const client = new pg.Client(process.env.DATABASE_URL);


var request = require("request");


app.get('/about-us', aboutUs);

function aboutUs(req, res) {
  res.render('pages/about-us')
}





// app.get('*', (req, res) => {
//   res.status(404).send('This route does not exist!!');
// })
// client.connect()
//   .then(() => {


//   });
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})