// src/components/AuthComponent.js
import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle } from '../utils/firebase';
import { useHistory } from 'react-router-dom';

const AuthComponent = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        history.push('/submit-recipe');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [history]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      history.push('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  if (user) {
    return (
      <div>
        <p>Welcome, {user.displayName}!</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Sign In to Submit Recipes</h2>
      <button onClick={handleSignIn}>Sign In with Google</button>
    </div>
  );
};

export default AuthComponent;
