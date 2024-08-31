// src/components/RecipeForm.js
import React, { useState } from 'react';
import { submitRecipe } from '../utils/googleSheets';

const RecipeForm = () => {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    steps: '',
    gameType: '',
    cookingMethod: '',
    cookingTime: ''
  });

  const gameTypes = ['Deer', 'Elk', 'Moose', 'Duck', 'Pheasant'];
  const cookingMethods = ['Grilling', 'Roasting', 'Smoking', 'Braising'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitRecipe(recipe);
      alert('Recipe submitted successfully!');
      // Reset form
      setRecipe({
        name: '',
        ingredients: '',
        steps: '',
        gameType: '',
        cookingMethod: '',
        cookingTime: ''
      });
    } catch (error) {
      alert('Error submitting recipe. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">Recipe Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="ingredients" className="block mb-2">Ingredients</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
          rows="4"
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="steps" className="block mb-2">Preparation Steps</label>
        <textarea
          id="steps"
          name="steps"
          value={recipe.steps}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
          rows="4"
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="gameType" className="block mb-2">Game Type</label>
        <select
          id="gameType"
          name="gameType"
          value={recipe.gameType}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select Game Type</option>
          {gameTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="cookingMethod" className="block mb-2">Cooking Method</label>
        <select
          id="cookingMethod"
          name="cookingMethod"
          value={recipe.cookingMethod}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select Cooking Method</option>
          {cookingMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="cookingTime" className="block mb-2">Cooking/Preparation Time (in minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Submit Recipe
      </button>
    </form>
  );
};

export default RecipeForm;
