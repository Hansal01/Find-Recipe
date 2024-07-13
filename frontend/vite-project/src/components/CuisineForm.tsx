import React, { useState } from 'react';
import axios from 'axios';
import { DetailedRecipe } from '../interface/DetailedRecipeInterface';
import { Recipe } from '../interface/RecipeInterface';

interface CuisineFormProps {
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<DetailedRecipe | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const CuisineForm: React.FC<CuisineFormProps> = ({ setRecipes, setSelectedRecipe, setError }) => {
  const [cuisine, setCuisine] = useState<string>('');

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

  return (
    <form onSubmit={getRecipesByCuisine} className="form">
      <h2 className="form-title">Get Recipes by Cuisine</h2>
      <div className="form-inputs">
        <input
          type="text"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Enter cuisine, e.g., Italian"
          className="form-input"
        />
        <button type="submit" className="form-button">Get Recipes</button>
      </div>
    </form>
  );
};

export default CuisineForm;
