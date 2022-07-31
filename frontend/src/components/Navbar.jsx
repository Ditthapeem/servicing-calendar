import React from "react";
import { useNavigate } from 'react-router-dom'

import '../assets/NavBar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const path = window.location.pathname;

  // useEffect(() => {
  //   setUser(JSON.parse(sessionStorage.getItem('user')))
  // }, []);

  function logout() {
    if (user) {
      sessionStorage.removeItem('user')
    }
    window.location.replace("/");
  }

	return (
    <div className='nav-bar'>
      <div>
        <button onClick={()=>{localStorage.state="home";  navigate('/home')}}
          className={path === "/home" ? 'nav-select' : 'nav-not-select'}>Home</button>
        <button onClick={()=>{localStorage.state="booking"; navigate('/booking')}}
          className={path === "/booking" ? 'nav-select' : 'nav-not-select'}>Booking</button>
        <button onClick={()=>{localStorage.state="about"; navigate('/about')}}
          className={path === "/about" ? 'nav-select' : 'nav-not-select'}>About</button>
      </div>
      <div>
        {user && <p>{{user}}</p>}
        <button className="nav-logout" onClick={logout} >Logout</button>
      </div>
    </div>
	);
}

export default Navbar;