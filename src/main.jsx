import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.jsx'
import Auth from './Auth.jsx'
import Movies from './Movies.jsx'
import MovieDetails from './MovieDetails.jsx';
import People from './People.jsx'
import { BrowserRouter, Routes,Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/data" element={<MovieDetails />} />
      <Route path="/people" element={<People />} />
    </Routes>
  </BrowserRouter>
  </StrictMode>
)
