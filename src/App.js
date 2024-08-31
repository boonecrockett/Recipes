import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeForm from './components/RecipeForm';
import AuthComponent from './components/AuthComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>North American Wild Game Recipes</h1>
        </header>
        <Routes>
          <Route path="/" element={<AuthComponent />} />
          <Route path="/submit-recipe" element={<RecipeForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
