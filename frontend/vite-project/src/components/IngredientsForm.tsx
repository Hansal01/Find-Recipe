import React, { useState } from 'react';
import axios from 'axios';
import { DetailedRecipe } from '../interface/DetailedRecipeInterface';
import { Recipe } from '../interface/RecipeInterface';

interface IngredientsFormProps {
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<DetailedRecipe | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const IngredientsForm: React.FC<IngredientsFormProps> = ({ setRecipes, setSelectedRecipe, setError }) => {
  const [ingredients, setIngredients] = useState<string>('');

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

  return (
    <form onSubmit={getRecipesByIngredients} className="form">
      <h2 className="form-title">Get Recipes by Ingredients</h2>
      <div className="form-inputs">
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients, e.g., apples, flour, sugar"
          className="form-input"
        />
        <button type="submit" className="form-button">Get Recipes</button>
      </div>
    </form>
  );
};

export default IngredientsForm;
