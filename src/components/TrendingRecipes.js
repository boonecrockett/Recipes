import { Link } from 'react-router-dom';
import { getSpreadSheetValues } from '../services/googleSheets';
import { formatRating } from '../utils/recipeUtils';

function TrendingRecipes() {
  const [trendingRecipes, setTrendingRecipes] = useState([]);

  useEffect(() => {
    fetchTrendingRecipes();
  }, []);

  const fetchTrendingRecipes = async () => {
    try {
      const response = await getSpreadSheetValues('Recipes');
      const recipesData = response.slice(1);
      const sortedRecipes = recipesData
        .map(row => ({
          id: row[0],
          name: row[1],
          gameType: row[2],
          cookingMethod: row[3],
          rating: parseFloat(row[8]),
          views: parseInt(row[11] || '0') // Assuming you add a 'views' column to track popularity
        }))
        .sort((a, b) => b.views - a.views || b.rating - a.rating)
        .slice(0, 10); // Get top 10 trending recipes
      setTrendingRecipes(sortedRecipes);
    } catch (error) {
      console.error('Error fetching trending recipes:', error);
    }
  };

  return (
    <div className="trending-recipes">
      <h2>Trending Recipes</h2>
      <ul>
        {trendingRecipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>
              <h3>{recipe.name}</h3>
              <p>Game Type: {recipe.gameType}</p>
              <p>Cooking Method: {recipe.cookingMethod}</p>
              <p>Rating: {formatRating(recipe.rating)}</p>
              <p>Views: {recipe.views}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrendingRecipes;
