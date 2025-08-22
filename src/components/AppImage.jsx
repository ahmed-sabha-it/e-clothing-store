import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        // Prevent infinite loop if placeholder also fails
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/400x400?text=Image+not+available";
      }}
      {...props}
    />
  );
}

export default Image;
