
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useScrollToTop } from "../utils/scrollToTop";

const NotFound = () => {
  useScrollToTop();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center py-16 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground animate-fade-in animation-delay-150">404</h1>
        <p className="text-xl text-muted-foreground mb-4 animate-fade-in animation-delay-300">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline animate-fade-in animation-delay-450">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
