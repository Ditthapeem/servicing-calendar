import React, { useLayoutEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

import configData from "../config";
import '../assets/NavBar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const path = window.location.pathname;

  useLayoutEffect(() => {
		if (!user) {
      window.location.replace("/");
    } else if (!user.user.is_staff) {
      window.location.replace("/home");
    }
  }, [user]);

  async function logout() {
    await axios.post(configData.API.LOGOUT, {
      headers:{'Authorization':'Token '+ user.token}
      })
      .then(response => {
        sessionStorage.clear()
        window.location.replace("/");
      })
      .catch(error => {
        window.alert(error)
      })
    }

	return (
    <div className='nav-bar'>
      <div>
        <button onClick={()=>{localStorage.state="reservation";  navigate('/reservation')}}
          className={path === "/reservation" ? 'nav-select' : 'nav-not-select'}>Home</button>
        <button onClick={()=>{localStorage.state="signup"; navigate('/signup')}}
          className={path === "/signup" ? 'nav-select' : 'nav-not-select'}>Signup</button>
        <button onClick={()=>{localStorage.state="customer"; navigate('/customer')}}
          className={path === "/customer" ? 'nav-select' : 'nav-not-select'}>Customer</button>
        {/* <button onClick={()=>{localStorage.state="booking"; navigate('/booking')}}
          className={path === "/booking" ? 'nav-select' : 'nav-not-select'}>Booking</button> */}
        <button onClick={()=>{localStorage.state="customerlist"; navigate('/customerlist')}}
          className={path === "/customerlist" ? 'nav-select' : 'nav-not-select'}>Customer List</button>
        <button onClick={()=>{localStorage.state="store"; navigate('/store')}}
          className={path === "/store" ? 'nav-select' : 'nav-not-select'}>Store</button>
        <button onClick={()=>{localStorage.state="admin"; window.location.assign(configData.API.ADMIN)}}
          className={'nav-not-select'}>Admin</button>
      </div>
      <div>
        {user && <><p>{user.user.username}</p>
        <input type="image" src={"logout_icon.png"} onClick={logout} /></>}
      </div>
    </div>
	);
}

export default Navbar;