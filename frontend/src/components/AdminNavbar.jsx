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
        <button onClick={()=>{localStorage.state="home";  navigate('/reservation')}}
          className={path === "/reservation" ? 'nav-select' : 'nav-not-select'}>Home</button>
        <button onClick={()=>{localStorage.state="booking"; navigate('/customer')}}
          className={path === "/customer" ? 'nav-select' : 'nav-not-select'}>Customer</button>
        <button onClick={()=>{localStorage.state="about"; navigate('/store')}}
          className={path === "/store" ? 'nav-select' : 'nav-not-select'}>Store</button>
      </div>
      <div>
        {user && <p>{{user}}</p>}
        <button className="nav-logout" onClick={logout} >Logout</button>
      </div>
    </div>
	);
}

export default Navbar;