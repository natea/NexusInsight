import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to NexusInsight</h1>
      <p>
        Navigate through complex information with intelligent search and interactive visual exploration.
      </p>
      <nav>
        <ul>
          <li>
            <Link to="/search">Go to Search</Link>
          </li>
          <li>
            <Link to="/explorer">Go to Visual Explorer</Link>
          </li>
        </ul>
      </nav>
      {/* Placeholder for featured content or a dashboard overview */}
    </div>
  );
};

export default HomePage;