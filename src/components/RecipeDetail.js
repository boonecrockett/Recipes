import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpreadSheetValues, getAuthToken, appendSpreadSheetValues, updateSpreadSheetValues } from '../services/googleSheets';
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
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
        auth,
        sheetName: 'Recipes'
      });

      const recipesData = response.data.values.slice(1);
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
      const auth = await getAuthToken();
      await updateSpreadSheetValues({
        spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
        auth,
        sheetName: 'Recipes',
        range: `K${recipe.id}`,
        values: [[!recipe.published]]
      });

      setRecipe({ ...recipe, published: !recipe.published });
    } catch (error) {
      console.error('Error toggling publication status:', error);
    }
  };

  const handleRating = async (rating) => {
    setUserRating(rating);
    try {
      const auth = await getAuthToken();
      await appendSpreadSheetValues({
        spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
        auth,
        sheetName: 'Ratings',
        values: [[id, rating]]
      });
      // You might want to update the average rating here or refetch the recipe
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const auth = await getAuthToken();
      if (isFavorite) {
        // Remove from favorites
        const response = await getSpreadSheetValues({
          spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
          auth,
          sheetName: 'Favorites'
        });
        const favoritesData = response.data.values.slice(1);
        const updatedFavorites = favoritesData.filter(row => !(row[0] === user.uid && row[1] === id));
        // Here you would update the entire 'Favorites' sheet with the updatedFavorites data
      } else {
        // Add to favorites
        await appendSpreadSheetValues({
          spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
          auth,
          sheetName: 'Favorites',
          values: [[user.uid, id]]
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling
