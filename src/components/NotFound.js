import React from 'react';
import { Link } from 'react-router-dom/Switch';

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go back to homepage</Link>
    </div>
  );
}

export default NotFound;
