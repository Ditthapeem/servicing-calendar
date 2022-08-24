import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

import configData from "../config";
import '../assets/Auth.css';

const Login = () => {
	const [inputs, setInputs] = useState({});
	let user = JSON.parse(sessionStorage.getItem('user'))

	useEffect(() => {
		if (user) {
      handleRedirect(user)
    }
  }, [user]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  async function login(data) {
    sessionStorage.setItem('user', JSON.stringify(data))
	handleRedirect(data)
  }

	function handleRedirect(user) {
		if (user.user.is_staff) {
			return window.location.replace("/reservation")
		} else {
			return window.location.replace("/home")
		}
	}

  async function handleLogin(event) {
    event.preventDefault();
    await axios.post(configData.API.LOGIN, inputs)
      .then(response => {
        login(response.data);
      })
      .catch(error => {
        window.alert("Wrong username or password. Note that both fields may be case-sensitive")
        console.log(error)
      })
  }

	return (
		<div style={{display: "flex", height: "100vh"}}>
			<div className="auth-sidebar">
				<h1 style={{textAlign: "left", fontSize: "40px"}}>Login</h1>
				<form onSubmit={handleLogin} style={{width: "100%"}}>
					<input
						type="text"
						name="username"
						placeholder="Username"
						value={inputs.username || ""}
						required
						onChange={handleChange}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={inputs.password || ""}
						required
						onChange={handleChange}
					/>
					<div className='auth-sign'>
						Create you account <Link to={"/signup"}>Sign Up</Link>
					</div>
					<button type="submit">Login</button>
				</form>
			</div>
			<div className="auth-poster">poster</div>
			{/* <img className="auth-poster"></img> */}
		</div>
	);
}

export default Login;