import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import { getSpreadSheetValues } from '../services/googleSheets';
import { formatRating } from '../utils/recipeUtils';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchUserRecipes(currentUser.email);
      fetchFavoriteRecipes(currentUser.uid);
    }
  };

  const fetchUserRecipes = async (userEmail) => {
    try {
      const response = await getSpreadSheetValues('Recipes');
      const recipesData = response.slice(1);
      const userRecipes = recipesData
        .filter(row => row[9] === userEmail)
        .map(row => ({
          id: row[0],
          name: row[1],
          gameType: row[2],
          cookingMethod: row[3],
          rating: parseFloat(row[8])
        }));
      setUserRecipes(userRecipes);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  };

  const fetchFavoriteRecipes = async (userId) => {
    try {
      const favoritesResponse = await getSpreadSheetValues('Favorites');
      const favoritesData = favoritesResponse.slice(1);
      const userFavorites = favoritesData
        .filter(row => row[0] === userId)
        .map(row => row[1]);

      const recipesResponse = await getSpreadSheetValues('Recipes');
      const recipesData = recipesResponse.slice(1);
      const favoriteRecipes = recipesData
        .filter(row => userFavorites.includes(row[0]))
        .map(row => ({
          id: row[0],
          name: row[1],
          gameType: row[2],
          cookingMethod: row[3],
          rating: parseFloat(row[8])
        }));
      setFavoriteRecipes(favoriteRecipes);
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>

      <h3>Your Recipes</h3>
      <ul>
        {userRecipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>
              <h4>{recipe.name}</h4>
              <p>Game Type: {recipe.gameType}</p>
              <p>Cooking Method: {recipe.cookingMethod}</p>
              <p>Rating: {formatRating(recipe.rating)}</p>
            </Link>
          </li>
        ))}
      </ul>

      <h3>Favorite Recipes</h3>
      <ul>
        {favoriteRecipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>
              <h4>{recipe.name}</h4>
              <p>Game Type: {recipe.gameType}</p>
              <p>Cooking Method: {recipe.cookingMethod}</p>
              <p>Rating: {formatRating(recipe.rating)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;
