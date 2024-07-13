import React, { useState } from 'react';
import axios from 'axios';
import { Recipe } from '../interface/RecipeInterface';
import { DetailedRecipe } from '../interface/DetailedRecipeInterface';

interface FoodNameFormProps {
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<DetailedRecipe | null>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>; // Rename to avoid conflict
}

const FoodNameForm: React.FC<FoodNameFormProps> = ({ setRecipes, setSelectedRecipe, setErrorMsg }) => {
  const [foodName, setFoodName] = useState<string>('');
  const [error, setError] = useState<string>(''); // Local error state

  const getRecipesByName = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/getRecipesByName', {
        foodName,
      });
      setRecipes(response.data.data.results);
      setSelectedRecipe(null);
      setError(''); // Reset local error state on successful response
      setErrorMsg(''); // Reset parent error state if needed
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch recipes');
      setErrorMsg('Failed to fetch recipes'); // Set parent error state if needed
    }
  };

  return (
    <form onSubmit={getRecipesByName} className="form">
      <h2 className="form-title">Get Recipes by Food Name</h2>
      <div className="form-inputs">
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="Enter food name, e.g., Pizza"
          className="form-input"
        />
        <button type="submit" className="form-button">Get Recipes</button>
      </div>
      {error && <p className="error-message">{error}</p>} 
    </form>
  );
};

export default FoodNameForm;
