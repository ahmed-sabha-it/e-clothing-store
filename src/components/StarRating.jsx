import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';

const StarRating = ({ 
  initialRating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 24,
  className = "",
  showValue = true 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  // Update rating when initialRating changes
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleStarClick = (starIndex) => {
    if (readonly) return;
    
    const newRating = starIndex + 1;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleStarHover = (starIndex) => {
    if (readonly) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="flex items-center gap-1" 
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(5)].map((_, index) => {
          const isActive = index < displayRating;
          const isHovered = hoverRating > 0 && index < hoverRating;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleStarHover(index)}
              disabled={readonly}
              className={`
                transition-all duration-200 transform
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                ${isHovered ? 'scale-110' : ''}
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 rounded
              `}
            >
              <Icon
                name="Star"
                size={size}
                className={`
                  transition-colors duration-200
                  ${isActive 
                    ? 'text-yellow-500 fill-current' 
                    : 'text-gray-300 dark:text-gray-600'
                  }
                  ${!readonly && 'hover:text-yellow-400'}
                `}
              />
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1">
          {displayRating > 0 ? `${displayRating}/5` : 'No rating'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
