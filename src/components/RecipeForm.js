import React, { useState } from 'react';

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
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/.netlify/functions/submitRecipe', {
        method: 'POST',
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error('Failed to submit recipe');
      }

      const result = await response.json();
      setSuccessMessage(result.message);
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Submit a Wild Game Recipe</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-bold text-gray-700">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ingredients" className="block mb-2 font-bold text-gray-700">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="steps" className="block mb-2 font-bold text-gray-700">Preparation Steps</label>
          <textarea
            id="steps"
            name="steps"
            value={recipe.steps}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="gameType" className="block mb-2 font-bold text-gray-700">Game Type</label>
          <select
            id="gameType"
            name="gameType"
            value={recipe.gameType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Game Type</option>
            {gameTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="cookingMethod" className="block mb-2 font-bold text-gray-700">Cooking Method</label>
          <select
            id="cookingMethod"
            name="cookingMethod"
            value={recipe.cookingMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Cooking Method</option>
            {cookingMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="cookingTime" className="block mb-2 font-bold text-gray-700">Cooking/Preparation Time (in minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <button 
          type="submit" 
          className={`w-full py-2 px-4 rounded font-bold text-white ${
            isSubmitting 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
