import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface StarRatingProps {
  rating: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <span key={i} className="relative inline-block">
          <FontAwesomeIcon icon={faStar} className="text-gray-300" />
          <span className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
          </span>
        </span>
      );
    } else {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300" />);
    }
  }
  
  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}; 