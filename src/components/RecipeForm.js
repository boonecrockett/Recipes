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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const gameTypes = ['Deer', 'Elk', 'Moose', 'Duck', 'Pheasant'];
  const cookingMethods = ['Grilling', 'Roasting', 'Smoking', 'Braising'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevState => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    if (!recipe.name.trim()) return 'Recipe name is required';
    if (!recipe.ingredients.trim()) return 'Ingredients are required';
    if (!recipe.steps.trim()) return 'Preparation steps are required';
    if (!recipe.gameType) return 'Game type is required';
    if (!recipe.cookingMethod) return 'Cooking method is required';
    if (!recipe.cookingTime.trim()) return 'Cooking time is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await submitRecipe(recipe);
      setSuccessMessage('Recipe submitted successfully!');
      setRecipe({
        name: '',
        ingredients: '',
        steps: '',
        gameType: '',
        cookingMethod: '',
        cookingTime: ''
      });
    } catch (error) {
      setError('Failed to submit recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit a Wild Game Recipe</h2>

      {error && <div className="mb-4 text-red-500">{error}</div>}
      {successMessage && <div className="mb-4 text-green-500">{successMessage}</div>}

      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 font-bold">Recipe Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="ingredients" className="block mb-2 font-bold">Ingredients</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          rows="4"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="steps" className="block mb-2 font-bold">Preparation Steps</label>
        <textarea
          id="steps"
          name="steps"
          value={recipe.steps}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          rows="4"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="gameType" className="block mb-2 font-bold">Game Type</label>
        <select
          id="gameType"
          name="gameType"
          value={recipe.gameType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Select Game Type</option>
          {gameTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="cookingMethod" className="block mb-2 font-bold">Cooking Method</label>
        <select
          id="cookingMethod"
          name="cookingMethod"
          value={recipe.cookingMethod}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Select Cooking Method</option>
          {cookingMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="cookingTime" className="block mb-2 font-bold">Cooking/Preparation Time (in minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          min="1"
          required
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
      </button>
    </form>
  );
};

export default RecipeForm;
