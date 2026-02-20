import React from 'react';
import ReactDOM from 'react-dom/client'; // Assure-toi d'importer depuis 'react-dom/client'
import './index.css';
import TodoApp from './components/TodoApp';

// Créer un root avec la méthode correcte pour React 18
const root = ReactDOM.createRoot(document.getElementById('root')); // Remplace `render` par `createRoot`
root.render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>
);