import React from 'react';
import { Link } from 'react-router-dom';
import { MetallicCard, MetallicBadge } from './ui/MetallicComponents';

const JobCard: React.FC<any> = ({ job }) => (
  <Link to={`/jobs/${job?.id || ''}`}>
    <MetallicCard className="p-4 hover:scale-[1.01] transition-transform">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{job?.title || 'Job Title'}</h3>
          <p className="text-sm text-gray-300">{job?.company || 'Company'}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400 mr-2">{job?.location || 'Location'}</div>
          {job?.isFeatured && <MetallicBadge variant="tech">Featured</MetallicBadge>}
        </div>
      </div>
    </MetallicCard>
  </Link>
);

export default JobCard;
