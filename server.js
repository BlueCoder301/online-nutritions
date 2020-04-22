'use strict';
const ejsLint = require('ejs-lint');

let mealsOutput = {};
let up = {};
let information = {};
let searchResults = {};
var calories;
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

app.get('/', getIndex);
app.get('/info', showCalculater);
app.get('/result', calculater);
app.get('/result1', usernameExist);
app.post('/diet', getMeals);
app.post('/meals', meals);
app.put('/update/:id', updateInfo);



app.get('/test', test);




function getMeals(req, res) {
  res.render('pages/meals');
}
app.get('/search', searchRout);

function getIndex(req, res) {
  res.render('pages/index');
}

function showCalculater(req, res) {
  res.render('pages/calculate');
}

function calculater(req, res) {
  let userName = req.query.username;
  let weightInfo = req.query.weight;
  let heightInfo = req.query.height;
  let ageInfo = req.query.age;
  let genderInfo = req.query.gender;
  let SQL1 = 'SELECT user_name FROM user_info;';
  client.query(SQL1)
    .then(data => {
      let exist = true;
      data.rows.forEach(val => {
        if (val.user_name === userName) { exist = false; }
      })
      if (exist) {
        let SQL = 'INSERT INTO user_info (user_name,weight,height,age,gender) VALUES ($1,$2,$3,$4,$5);';
        let safeValues = [userName, weightInfo, heightInfo, ageInfo, genderInfo];
        client.query(SQL, safeValues)
          .then(data => { console.log('done'); })
        var informationOptions = {
          method: 'POST',
          url: 'https://bmi.p.rapidapi.com/',
          headers: {
            'x-rapidapi-host': 'bmi.p.rapidapi.com',
            'x-rapidapi-key': 'de72feb0d1msh4cd6880191f064fp1248d3jsnb2c8b04da480',
            'content-type': 'application/json',
            accept: 'application/json'
          },
          body: {
            weight: { value: weightInfo, unit: 'kg' },
            height: { value: heightInfo, unit: 'cm' },
            sex: genderInfo,
            age: ageInfo
          },
          json: true
        };
        request(informationOptions, function (error, response, body) {
          if (error) throw new Error(error);
          information = body;
          calories = information.bmr.value;
          res.render('pages/results', { info: information });
        });
      } else {
        res.render('pages/calculate', { msg: 'This user name is already exist' });
      }


    })
}

function usernameExist(req, res) {
  let userNameKeyword = req.query.previousUsername;
  let SQL = `SELECT user_name FROM user_info ;`;
  client.query(SQL)
    .then(data => {
      let exist = false;
      data.rows.forEach(val => {
        if (val.user_name === userNameKeyword) { exist = true; }
      })
      if (exist) {
        let SQL1 = `SELECT * FROM user_info WHERE user_name = '${userNameKeyword}';`;
        client.query(SQL1)
          .then(dataSaved => {
            var informationOptions = {
              method: 'POST',
              url: 'https://bmi.p.rapidapi.com/',
              headers: {
                'x-rapidapi-host': 'bmi.p.rapidapi.com',
                'x-rapidapi-key': 'de72feb0d1msh4cd6880191f064fp1248d3jsnb2c8b04da480',
                'content-type': 'application/json',
                accept: 'application/json'
              },
              body: {
                weight: { value: dataSaved.rows[0].weight, unit: 'kg' },
                height: { value: dataSaved.rows[0].height, unit: 'cm' },
                sex: dataSaved.rows[0].gender,
                age: dataSaved.rows[0].age
              },
              json: true
            };
            request(informationOptions, function (error, response, body) {
              if (error) throw new Error(error);
              information = body;
              calories = information.bmr.value;
              res.render('pages/results', { info: information, DB: dataSaved.rows[0] });

            });

          })
      }
      else {
        res.render('pages/calculate', { msg: 'This user name is not exist' });
      }

    })

}
function meals(req, res) {
  let type = req.body.Vegan;
  // var mealOptions = {
  //   method: 'GET',
  //   url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate',
  //   qs: {
  //     timeFrame: 'day',
  //     targetCalories: calories,
  //     diet: type
  //   },
  //   headers: {
  //     'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
  //     'x-rapidapi-key': 'b820fef805msh1a93420a1b4c6c8p1e9f5cjsn4cf876c5874e'
  //   }
  // };
  var options1 = {
    method: 'GET',
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients',
    qs: {
      minCarbs: '0',
      minProtein: '0',
      offset: '0',
      number: '10',
      random: true,
      maxCalories: calories,

      limitLicense: 'false'
    },
    headers: {
      'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      'x-rapidapi-key': 'b820fef805msh1a93420a1b4c6c8p1e9f5cjsn4cf876c5874e'
    }

  };
  var mealsOutput1 = {};
  request(options1, function (error, response, body) {
    if (error) throw new Error(error);
    mealsOutput1 = JSON.parse(body);
    res.render('pages/meals', { meal1: mealsOutput1 });
  });

  // request(mealOptions, function (error, response, body) {
  //   if (error) throw new Error(error);
  //   mealsOutput = JSON.parse(body);
  //   console.log(mealsOutput1);

  // });
}


function searchRout(req, res) {
  let keyWord = req.query.input;
  var options = {
    method: 'GET',
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex',
    qs: {
      query: keyWord,
      minProtein: '5',
      maxProtein: '100',
      limitLicense: 'false',
      offset: '0',
      number: '12'
    },
    headers: {
      'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      'x-rapidapi-key': 'de72feb0d1msh4cd6880191f064fp1248d3jsnb2c8b04da480'
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    searchResults = JSON.parse(body);;
    res.render('pages/search', { food: searchResults });
  });
}

function updateInfo(req, res) {
  let unique = req.params.id;
  let { weight, height, age } = req.body;
  let SQL = 'UPDATE user_info SET weight=$1,height=$2,age=$3 WHERE user_name=$4;';
  let safe = [weight, height, age, unique];
  client.query(SQL, safe)
    .then(res.redirect(`/result1?previousUsername=${unique}`))


}




function aboutUs(req, res) {
  res.render('pages/about-us')
}

function test(req, res) {
  res.render('pages/test')
}






app.get('*', (req, res) => {
  res.status(404).send('This route does not exist!!');
})

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`)
    })
  });










