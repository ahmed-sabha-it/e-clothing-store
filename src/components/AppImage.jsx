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
        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial, sans-serif' font-size='16' fill='%23666' text-anchor='middle' dy='0.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
      }}
      {...props}
    />
  );
}

export default Image;
