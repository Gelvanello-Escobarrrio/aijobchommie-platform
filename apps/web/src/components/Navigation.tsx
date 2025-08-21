import React from 'react';
import { Link } from 'react-router-dom';
import { MetallicButton } from './ui/MetallicComponents';

const Navigation: React.FC = () => (
  <nav className="w-full py-4">
    <div className="responsive-container flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-lg">AI Job Chommie</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/jobs" className="text-sm">Jobs</Link>
        <Link to="/dashboard" className="text-sm">Dashboard</Link>
        <Link to="/auth/login">
          <MetallicButton variant="outline" size="sm">Sign In</MetallicButton>
        </Link>
      </div>
    </div>
  </nav>
);

export default Navigation;
