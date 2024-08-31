import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      navigate('/submit-recipe');
    } catch (error) {
      console.error('Error signing in with Google', error);
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="auth-container">
        <h2>Welcome, {user.displayName}!</h2>
        <p>You&apos;re signed in with: {user.email}</p>
        {user.photoURL && <img src={user.photoURL} alt="Profile" className="profile-image" />}
        <button type="button" onClick={handleSignOut} className="sign-out-button">Sign Out</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Sign In to Submit Recipes</h2>
      <button type="button" onClick={handleSignIn} className="sign-in-button">Sign In with Google</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AuthComponent;
