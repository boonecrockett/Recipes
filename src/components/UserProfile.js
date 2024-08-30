import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import { getSpreadSheetValues, getAuthToken } from '../services/googleSheets';
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
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        sprea
