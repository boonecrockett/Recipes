import React, { useState } from 'react';
import { appendSpreadSheetValues } from '../services/googleSheets';
import { getCurrentUser } from '../services/auth';
import { gameTypes, cookingMethods } from '../utils/recipeUtils';

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    gameType: '',
    customGameType: '',
    cookingMethod: '',
    ingredients: '',
    steps: '',
    prepTime: '',
    cookTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await getCurrentUser();
    if (!user) {
      alert('You must be logged in to submit a recipe');
      return;
    }

    const finalGameType = recipe.gameType === 'Other' ? recipe.customGameType : recipe.gameType;

    const recipeData = [
      Date.now().toString(), // Use timestamp as ID
      recipe.name,
      finalGameType,
      recipe.cookingMethod,
      recipe.ingredients,
      recipe.steps,
      recipe.prepTime,
      recipe.cookTime,
      '0', // Initial rating
      user.email,
      'FALSE' // Initially unpublished
    ];

    try {
      await appendSpreadSheetValues('Recipes', [recipeData]);
      alert('Recipe submitted successfully!');
      setRecipe({
        name: '',
        gameType: '',
        customGameType: '',
        cookingMethod: '',
        ingredients: '',
        steps: '',
        prepTime: '',
        cookTime: ''
      });
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to submit recipe. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Recipe</h2>

      <div>
        <label htmlFor="name">Recipe Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="gameType">Game Type:</label>
        <select
          id="gameType"
          name="gameType"
          value={recipe.gameType}
          onChange={handleChange}
          required
        >
          <option value="">Select a game type</option>
          {gameTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {recipe.gameType === 'Other' && (
        <div>
          <label htmlFor="customGameType">Custom Game Type:</label>
          <input
            type="text"
            id="customGameType"
            name="customGameType"
            value={recipe.customGameType}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="cookingMethod">Cooking Method:</label>
        <select
          id="cookingMethod"
          name="cookingMethod"
          value={recipe.cookingMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select a cooking method</option>
          {cookingMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ingredients">Ingredients:</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="steps">Preparation Steps:</label>
        <textarea
          id="steps"
          name="steps"
          value={recipe.steps}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="prepTime">Preparation Time:</label>
        <input
          type="text"
          id="prepTime"
          name="prepTime"
          value={recipe.prepTime}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="cookTime">Cooking Time:</label>
        <input
          type="text"
          id="cookTime"
          name="cookTime"
          value={recipe.cookTime}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit Recipe</button>
    </form>
  );
}

export default AddRecipe;
