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
app.get('/' , getIndex);

function getIndex(req,res){
  res.render('pages/index');
}

// // BMI Calculator API
// //-----------------------------------------------------------------------------------
// var options = {
//   method: 'POST',
//   url: 'https://bmi.p.rapidapi.com/',
//   headers: {
//     'x-rapidapi-host': 'bmi.p.rapidapi.com',
//     'x-rapidapi-key': '4218e6b09amsh83ad7514517c049p1976dbjsn3737c4582a4c',
//     'content-type': 'application/json',
//     accept: 'application/json'
//   },
//   body: {
//     weight: {value: '85.00', unit: 'kg'},
//     height: {value: '170.00', unit: 'cm'},
//     sex: 'm',
//     age: '24',
//     waist: '34.00',
//     hip: '40.00'
//   },
//   json: true
// };

// request(options, function (error, response, body) {
// 	if (error) throw new Error(error);

//     console.log(body);
// });

// //-----------------------------------------------------------------------------------

// // Get Meal Plane 
// //-----------------------------------------------------------------------------------

// var request = require("request");

// var options = {
//   method: 'GET',
//   url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate',
//   qs: {
//     timeFrame: 'day',
//     targetCalories: '2000',
//     diet: 'vegetarian',
//     exclude: 'shellfish%2C olives'
//   },
//   headers: {
//     'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
//     'x-rapidapi-key': '4218e6b09amsh83ad7514517c049p1976dbjsn3737c4582a4c'
//   }
// };

// request(options, function (error, response, body) {
// 	if (error) throw new Error(error);

// 	console.log(body);
// });
// //-----------------------------------------------------------------------------------
// // Get calories in meal  

// var request = require("request");

// var options = {
//   method: 'GET',
//   url: 'https://nutritionix-api.p.rapidapi.com/v1_1/search/cheddar%2520cheese',
//   qs: {fields: 'item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat'},
//   headers: {
//     'x-rapidapi-host': 'nutritionix-api.p.rapidapi.com',
//     'x-rapidapi-key': '4218e6b09amsh83ad7514517c049p1976dbjsn3737c4582a4c'
//   }
// };

// request(options, function (error, response, body) {
// 	if (error) throw new Error(error);

// 	console.log(body);
// });
//-----------------------------------------------------------------------------------

function aboutUs(req, res) {
  res.render('pages/about-us')
}





app.get('*', (req, res) => {
  res.status(404).send('This route does not exist!!');
})
// client.connect()
//   .then(() => {


//   });

app.get('*', (req, res) => {
    res.status(404).send('This route does not exist!!');
})

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})

// client.connect()
//     .then(() => {
      

//     })
