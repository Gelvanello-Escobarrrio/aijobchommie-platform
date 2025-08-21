import React from 'react';
import '../styles/ui-helpers.css';

const LoadingSpinner: React.FC<{ size?: 'sm'|'md'|'lg'; text?: string }> = ({ size='md', text }) => {
  const dim = size === 'lg' ? 64 : size === 'sm' ? 24 : 40;
  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: dim, height: dim }} className="rounded-full border-4 border-white/10 border-t-[--tech-cyan] animate-spin" />
      {text && <div className="mt-3 text-gray-300">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
