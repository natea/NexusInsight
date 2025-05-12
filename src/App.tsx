import React from 'react';
import AppRouter from './Router'; // Import the AppRouter
import './App.css'; // Optional: if you want global app styles

function App() {
  return (
    <div className="app-container">
      <AppRouter />
    </div>
  );
}

export default App;