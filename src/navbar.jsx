import './navbar.css';

import {NavLink, useNavigate } from 'react-router-dom'
import { Navbar } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { APIcall } from './Auth';

export default function NavBar() { 
    const navigate = useNavigate()

    /**
     * Function to handle logout
     */
    const handleLogout = async () => {
        try{
            const refreshToken = localStorage.getItem("Rtoken");
            const url = "http://4.237.58.241:3000/user/logout"
            const response = await APIcall(url, "POST", {refreshToken})
            localStorage.clear()
            alert("You have been logged out.");
            navigate("/")
        }
        catch (error){
            console.error(error.message);
            alert("Error: Failed to log out");
        }
    };

    return(
        <div className='navbar'>
        <Navbar color="dark" light expand="md" container="false">
            <NavLink to="/" className="navbar-brand" id='Home'>
            Home
            </NavLink>
            <NavLink to="/movies" className="navbar-brand" id='Movies'>
            Movies
            </NavLink>
            {
                localStorage.getItem("Btoken") ?
            <NavLink to="/" className="navbar-brand" id='Auth' onClick={handleLogout}>
            Logout
            </NavLink> :
            <NavLink to="/auth" className="navbar-brand" id='Auth'>
            Login/Register
            </NavLink> 
            }
        </Navbar>
        </div>
    )
}