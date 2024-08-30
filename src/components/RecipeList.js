import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSpreadSheetValues, getAuthToken } from '../services/googleSheets';
import { gameTypes, cookingMethods, formatRating } from '../utils/recipeUtils';
import { getCurrentUser } from '../services/auth';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGameType, setSelectedGameType] = useState('');
  const [selectedCookingMethod, setSelectedCookingMethod] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchRecipes();
    checkAdminStatus();
  }, []);

  useEffect(() => {
    filterAndSortRecipes();
  }, [recipes, searchTerm, selectedGameType, selectedCookingMethod, minRating, sortBy, sortOrder, showUnpublished]);

  const checkAdminStatus = async () => {
    const user = await getCurrentUser();
    setIsAdmin(user && user.email === 'admin@example.com');
  };

  const fetchRecipes = async () => {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
        auth,
        sheetName: 'Recipes'
      });

      const recipesData = response.data.values.slice(1).map(row => ({
        id: row[0],
        name: row[1],
        gameType: row[2],
        cookingMethod: row[3],
        prepTime: row[4],
        cookTime: row[5],
        rating: parseFloat(row[6]),
        published: row[10] === 'TRUE'
      }));

      setRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const filterAndSortRecipes = () => {
    let filtered = recipes.filter(recipe => 
      (showUnpublished || recipe.published) &&
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGameType === '' || recipe.gameType === selectedGameType) &&
      (selectedCookingMethod === '' || recipe.cookingMethod === selectedCookingMethod) &&
      recipe.rating >= minRating
    );

    filtered.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRecipes(filtered);
  };

  return (
    <div>
      <h2>Wild Game Recipes</h2>
      
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <select
        value={selectedGameType}
        onChange={(e) => setSelectedGameType(e.target.value)}
      >
        <option value="">All Game Types</option>
        {gameTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select
        value={selectedCookingMethod}
        onChange={(e) => setSelectedCookingMethod(e.target.value)}
      >
        <option value="">All Cooking Methods</option>
        {cookingMethods.map(method => (
          <option key={method} value={method}>{method}</option>
        ))}
      </select>

      <select
        value={minRating}
        onChange={(e) => setMinRating(parseFloat(e.target.value))}
      >
        <option value={0}>All Ratings</option>
        <option value={1}>1+ Stars</option>
        <option value={2}>2+ Stars</option>
        <option value={3}>3+ Stars</option>
        <option value={4}>4+ Stars</option>
        <option value={4.5}>4.5+ Stars</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Sort by Name</option>
        <option value="rating">Sort by Rating</option>
        <option value="prepTime">Sort by Prep Time</option>
        <option value="cookTime">Sort by Cook Time</option>
      </select>

      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        {sortOrder === 'asc' ? '▲' : '▼'}
      </button>
      
      {isAdmin && (
        <label>
          <input
            type="checkbox"
            checked={showUnpublished}
            onChange={(e) => setShowUnpublished(e.target.checked)}
          />
          Show Unpublished Recipes
        </label>
      )}

      <ul>
        {filteredRecipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>
              <h3>{recipe.name} {!recipe.published && isAdmin && " (Unpublished)"}</h3>
              <p>Game Type: {recipe.gameType}</p>
              <p>Cooking Method: {recipe.cookingMethod}</p>
              <p>Prep Time: {recipe.prepTime}</p>
              <p>Cook Time: {recipe.cookTime}</p>
              <p>Rating: {formatRating(recipe.rating)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;
