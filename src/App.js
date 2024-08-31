import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RecipeForm from './components/RecipeForm';
import AuthComponent from './components/AuthComponent';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>North American Wild Game Recipes</h1>
        </header>
        <Switch>
          <Route exact path="/" component={AuthComponent} />
          <ProtectedRoute path="/submit-recipe" component={RecipeForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
