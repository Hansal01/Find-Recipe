const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const API_KEY = 'aac33a48195744fc9c9f55d6eb395b39';

app.get("/", (req, res) => {
    res.json({ message: 'Welcome to the Recipe API' });
});

app.post('/getRecipesByIngredients', async (req, res) => {
    const ingredients = req.body.ingredients;

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
            params: { 
                ingredients: ingredients.join(','),
                number: 5,
                limitLicense: true,
                ranking: 1,
                ignorePantry: false,
                apiKey: API_KEY,
            },
        });
        // res.json(response.data); // Send the JSON data directly
        res.json({data:response.data});
        
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).send(error.message);
        } else {
          res.status(500).send('An unexpected error occurred');
        }
      }
    });
    
    app.post('/getRecipesByCuisine', async (req, res) => {
      const cuisine = req.body.cuisine;
    
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
          params: {
            cuisine: cuisine,
            number: 5,
            apiKey: API_KEY,
          },
        });
        res.json({ data: response.data });
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
          res.status(500).send(error.message);
        } else {
          res.status(500).send('An unexpected error occurred');
        }
      }
    });
    app.post('/getRecipesById', async(req, res) => {
      const cuisine = req.body.cuisine;
      console.log(cuisine);
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/informationBulk`, {
          params: {
            ids: cuisine,
            apiKey: API_KEY,
          },
        });
        // res.json(response.data);
        console.log(response.data);
        res.json({data:response.data});
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).send(error.message);
        } else {
          res.status(500).send('An unexpected error occurred');
        }
      }
    })

    app.post('/getRecipesByName', async (req, res) => {
      const foodName = req.body.foodName;
  
      try {
          const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
              params: {
                  query: foodName,
                  number: 5,
                  apiKey: API_KEY,
              },
          });
          res.json({ data: response.data });
      } catch (error) {
          if (error instanceof Error) {
              res.status(500).send(error.message);
          } else {
              res.status(500).send('An unexpected error occurred');
          }
      }
  });
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
