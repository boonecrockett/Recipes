import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import RecipeList from './RecipeList';
import RecipeDetail from './RecipeDetail';
import AddRecipe from './AddRecipe';
import Login from './Login';
import UserProfile from './UserProfile';
import TrendingRecipes from './TrendingRecipes';
import NotFound from './NotFound'; // You'll need to create this component

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" component={RecipeList} />
          <Route path="/recipe/:id" component={RecipeDetail} />
          <Route path="/add-recipe" component={AddRecipe} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/trending" component={TrendingRecipes} />
          <Route component={NotFound} /> {/* This will catch all unmatched routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
