import React from "react";

const PageTitle = ({ children, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
        {children}
      </h1>
      {subtitle && (
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle; 