import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom/Switch';
import { getSpreadSheetValues, appendSpreadSheetValues, updateSpreadSheetValues } from '../services/googleSheets';
import { formatRating } from '../utils/recipeUtils';
import { getCurrentUser } from '../services/auth';

function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchRecipe();
    fetchCurrentUser();
  }, [id]);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
      checkAdminStatus();
    }
  }, [user, id]);

  const fetchCurrentUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const checkAdminStatus = () => {
    setIsAdmin(user && user.email === 'admin@example.com');
  };

  const fetchRecipe = async () => {
    try {
      const response = await getSpreadSheetValues('Recipes');
      const recipesData = response.slice(1);
      const recipeData = recipesData.find(row => row[0] === id);

      if (recipeData) {
        setRecipe({
          id: recipeData[0],
          name: recipeData[1],
          gameType: recipeData[2],
          cookingMethod: recipeData[3],
          ingredients: recipeData[4],
          steps: recipeData[5],
          prepTime: recipeData[6],
          cookTime: recipeData[7],
          rating: parseFloat(recipeData[8]),
          submittedBy: recipeData[9],
          published: recipeData[10] === 'TRUE'
        });
      } else {
        console.error('Recipe not found');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  const togglePublicationStatus = async () => {
    if (!isAdmin) return;

    try {
      await updateSpreadSheetValues(`Recipes!K${recipe.id}`, [[!recipe.published]]);
      setRecipe({ ...recipe, published: !recipe.published });
    } catch (error) {
      console.error('Error toggling publication status:', error);
    }
  };

  const handleRating = async (rating) => {
    setUserRating(rating);
    try {
      await appendSpreadSheetValues('Ratings', [[id, rating]]);
      // You might want to update the average rating here or refetch the recipe
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await getSpreadSheetValues('Favorites');
        const favoritesData = response.slice(1);
        const updatedFavorites = favoritesData.filter(row => !(row[0] === user.uid && row[1] === id));
        // Here you would update the entire 'Favorites' sheet with the updatedFavorites data
      } else {
        // Add to favorites
        await appendSpreadSheetValues('Favorites', [[user.uid, id]]);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await getSpreadSheetValues('Favorites');
      const favoritesData = response.slice(1);
      const isFav = favoritesData.some(row => row[0] === user.uid && row[1] === id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-detail">
      <h2>{recipe.name}</h2>
      {isAdmin && (
        <button onClick={togglePublicationStatus}>
          {recipe.published ? 'Unpublish' : 'Publish'}
        </button>
      )}
      <p><strong>Game Type:</strong> {recipe.gameType}</p>
      <p><strong>Cooking Method:</strong> {recipe.cookingMethod}</p>
      <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
      <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
      <p><strong>Rating:</strong> {formatRating(recipe.rating)}</p>

      <h3>Ingredients:</h3>
      <p>{recipe.ingredients}</p>

      <h3>Preparation Steps:</h3>
      <p>{recipe.steps}</p>

      <p><em>Submitted by: {recipe.submittedBy}</em></p>

      <div>
        <h3>Rate this recipe:</h3>
        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(rating => (
          <button key={rating} onClick={() => handleRating(rating)}>
            {rating}
          </button>
        ))}
      </div>

      {user && (
        <button onClick={toggleFavorite}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      )}
    </div>
  );
}

export default RecipeDetail;
