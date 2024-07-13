import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import sanitizeHtml from 'sanitize-html';
import IngredientsForm from './components/IngredientsForm';
import CuisineForm from './components/CuisineForm';
import FoodNameForm from './components/FoodNameForm';
import { Recipe } from './interface/RecipeInterface';
import { DetailedRecipe } from './interface/DetailedRecipeInterface';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<DetailedRecipe | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getDetailedRecipe = async (recipeId: number) => {
    try {
      const response = await axios.post('http://localhost:3000/getRecipesById', {
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

      <div className="form-container">
        <IngredientsForm setRecipes={setRecipes} setSelectedRecipe={setSelectedRecipe} setError={setError} />
      </div>

      <div className="form-container">
        <CuisineForm setRecipes={setRecipes} setSelectedRecipe={setSelectedRecipe} setError={setError} />
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="form-container">
        <FoodNameForm setRecipes={setRecipes} setSelectedRecipe={setSelectedRecipe} setError={setError} />
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="recipes-container">
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
      </div>

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