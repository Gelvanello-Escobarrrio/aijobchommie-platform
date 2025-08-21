import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Page not found</h1>
      <p className="mb-6">Sorry, we couldn't find that page.</p>
      <Link to="/" className="text-blue-600 font-semibold">Go back home</Link>
    </div>
  </div>
);

export default NotFoundPage;
