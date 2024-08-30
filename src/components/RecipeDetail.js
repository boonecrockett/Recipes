import { useParams } from 'react-router-dom';
import { getSpreadSheetValues, appendSpreadSheetValues, updateSpreadSheetValues } from '../services/googleSheets';
import { formatRating } from '../utils/recipeUtils';
import { getCurrentUser } from '../services/auth';

function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchRecipe = useCallback(async () => {
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
        setError('Recipe not found');
      }
    } catch (error) {
      setError('Error fetching recipe: ' + error.message);
    }
  }, [id]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setError('Error fetching user: ' + error.message);
    }
  }, []);

  useEffect(() => {
    fetchRecipe();
    fetchCurrentUser();
  }, [fetchRecipe, fetchCurrentUser]);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
      setIsAdmin(user.email === 'admin@example.com');
    }
  }, [user, id]);

  const togglePublicationStatus = async () => {
    if (!isAdmin) return;

    try {
      await updateSpreadSheetValues(`Recipes!K${recipe.id}`, [[!recipe.published]]);
      setRecipe({ ...recipe, published: !recipe.published });
    } catch (error) {
      setError('Error toggling publication status: ' + error.message);
    }
  };

  const handleRating = async (rating) => {
    setUserRating(rating);
    try {
      const response = await getSpreadSheetValues('Ratings');
      const ratingsData = response.slice(1);
      const existingRatingIndex = ratingsData.findIndex(row => row[0] === id && row[1] === user.uid);
      
      if (existingRatingIndex !== -1) {
        // Update existing rating
        await updateSpreadSheetValues(`Ratings!C${existingRatingIndex + 2}`, [[rating]]);
      } else {
        // Add new rating
        await appendSpreadSheetValues('Ratings', [[id, user.uid, rating]]);
      }
      
      // Refetch recipe to update average rating
      await fetchRecipe();
    } catch (error) {
      setError('Error submitting rating: ' + error.message);
    }
  };

  const toggleFavorite = async () => {
    try {
      const response = await getSpreadSheetValues('Favorites');
      const favoritesData = response.slice(1);
      
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favoritesData.filter(row => !(row[0] === user.uid && row[1] === id));
        await updateSpreadSheetValues('Favorites!A2:B', updatedFavorites);
      } else {
        // Add to favorites
        await appendSpreadSheetValues('Favorites', [[user.uid, id]]);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      setError('Error toggling favorite: ' + error.message);
    }
  };

  const checkIfFavorite = useCallback(async () => {
    try {
      const response = await getSpreadSheetValues('Favorites');
      const favoritesData = response.slice(1);
      const isFav = favoritesData.some(row => row[0] === user.uid && row[1] === id);
      setIsFavorite(isFav);
    } catch (error) {
      setError('Error checking favorite status: ' + error.message);
    }
  }, [user, id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

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
          <button 
            key={rating} 
            onClick={() => handleRating(rating)}
            aria-label={`Rate ${rating} stars`}
          >
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
