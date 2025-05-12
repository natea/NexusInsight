import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ExplorerPage from './pages/ExplorerPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <header className="app-header">
        <nav className="app-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/explorer">Explorer</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          {/* Add other routes here */}
          <Route path="*" element={<div><h1>404 - Page Not Found</h1><Link to="/">Go Home</Link></div>} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} NexusInsight</p>
      </footer>
    </BrowserRouter>
  );
};

export default AppRouter;