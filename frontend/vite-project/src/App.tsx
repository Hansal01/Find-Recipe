import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import sanitizeHtml from 'sanitize-html'; // Import sanitize-html for HTML sanitization

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface DetailedRecipe {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number;
  cookingMinutes: number;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: {
    id: number;
    aisle: string;
    image: string;
    consistency: string;
    name: string;
    nameClean: string;
    original: string;
    originalName: string;
    amount: number;
    unit: string;
    meta: string[];
    measures: {
      us: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
      metric: {
        amount: number;
        unitShort: string;
        unitLong: string;
      };
    };
  }[];
  instructions: string; // Update interface to include instructions as a string
}

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<DetailedRecipe | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const getRecipesByIngredients = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/getRecipesByIngredients', {
        ingredients: ingredients.split(',').map((item) => item.trim()),
      });
      setRecipes(response.data.data); // Assuming response.data is an array of Recipe objects
      setSelectedRecipe(null); // Clear selected recipe when new search is made
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getRecipesByCuisine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/getRecipesByCuisine', {
        cuisine,
      });
      setRecipes(response.data.data); // Assuming response.data is an array of Recipe objects
      setSelectedRecipe(null); // Clear selected recipe when new search is made
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getDetailedRecipe = async (recipeId: number) => {
    console.log(recipeId);
    try {
      const response = await axios.post(`http://localhost:3000/getRecipesById`,{
        cuisine:recipeId,

      }); // Replace with your backend endpoint for detailed recipe
      setSelectedRecipe(response.data.data[0]); // Assuming response.data is a DetailedRecipe object
      setShowPopup(true); // Show the popup
    } catch (error) {
      console.error('Error fetching detailed recipe:', error);
    }
  };
  const closePopup = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="App">
      <h1>AI-Powered Recipe Recommendation App</h1>

      <form onSubmit={getRecipesByIngredients}>
        <h2>Get Recipes by Ingredients</h2>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients, e.g., apples, flour, sugar"
        />
        <button type="submit">Get Recipes</button>
      </form>

      <form onSubmit={getRecipesByCuisine}>
        <h2>Get Recipes by Cuisine</h2>
        <input
          type="text"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Enter cuisine, e.g., Italian"
        />
        <button type="submit">Get Recipes</button>
      </form>

      <div className="recipes">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe" onClick={() => getDetailedRecipe(recipe.id)}>
            <h3>{recipe.title}</h3>
            <img src={recipe.image} alt={recipe.title} />
          </div>
        ))}
      </div>

      {showPopup && selectedRecipe && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} />
            <h3>Ingredients:</h3>
            <ul>
              {selectedRecipe.extendedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            {/* Render HTML content safely */}
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedRecipe.instructions) }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
