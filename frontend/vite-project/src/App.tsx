import React, { ReactNode, useState } from 'react';
import axios from 'axios';
import './App.css';
import sanitizeHtml from 'sanitize-html';

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface DetailedRecipe {
  image: string | undefined;
  title: ReactNode;
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
  instructions: string;
}

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<DetailedRecipe | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getRecipesByIngredients = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/getRecipesByIngredients', {
        ingredients: ingredients.split(',').map((item) => item.trim()),
      });
      setRecipes(response.data.data);
      setSelectedRecipe(null);
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
      setRecipes(response.data.data.results);
      setSelectedRecipe(null);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch recipes');
    }
  };

  const getDetailedRecipe = async (recipeId: number) => {
    try {
      const response = await axios.post(`http://localhost:3000/getRecipesById`, {
        cuisine: recipeId,
      });
      setSelectedRecipe(response.data.data[0]);
      setShowPopup(true);
    } catch (error) {
      console.error('Error fetching detailed recipe:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="app-container">
      <h1 className="text-4xl font-bold mb-6 text-center">Recipe Recommendation App</h1>

      <div className="w-full max-w-lg mb-6">
        <form onSubmit={getRecipesByIngredients} className="mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-center">Get Recipes by Ingredients</h2>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients, e.g., apples, flour, sugar"
            className="border p-2 w-full mb-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Get Recipes</button>
        </form>
      </div>

      <div className="w-full max-w-lg mb-6">
        <form onSubmit={getRecipesByCuisine} className="mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-center">Get Recipes by Cuisine</h2>
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="Enter cuisine, e.g., Italian"
            className="border p-2 w-full mb-2 rounded"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">Get Recipes</button>
        </form>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe border p-4 rounded shadow cursor-pointer bg-white"
            onClick={() => getDetailedRecipe(recipe.id)}
          >
            <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover" />}
          </div>
        ))}

      {showPopup && selectedRecipe && (
        <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="popup-content bg-white p-6 rounded shadow-lg relative max-w-2xl mx-auto">
            <span className="close absolute top-0 right-0 p-4 cursor-pointer text-xl" onClick={closePopup}>&times;</span>
            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} className="w-full h-64 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside mb-4">
              {selectedRecipe.extendedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedRecipe.instructions) }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
