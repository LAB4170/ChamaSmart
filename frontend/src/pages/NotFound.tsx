import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="#/" className="btn">
        Go Home
      </a>
    </div>
  );
};

export default NotFound;
