import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'
import NavBar from './navbar';


function App() {
  return (
    <>
    <div className='navbar'>    
      <NavBar/>
    </div>
     <div id="Welcome-message">
      <h1>Dyllon Tan's Fabulous Movie Searching Website</h1>
      <img src="./hero.jpg" alt='Hero image' ></img>
      <p>I hope you find the movie you're after</p>
     </div>
     <div id="footer">
      <p>All data is from IMDB, Metacritic and RottenTomatoes</p>
      <p>© 2025 Dyllon Tan</p>
     </div>
    </>
  )
}
export default App


/*
TODO: 
confirm password for registration
 */