import React, { useState } from "react";
import axios from 'axios';

import '../assets/Login.css';

const Login = () => {
	const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  async function login(data) {
    sessionStorage.setItem('user', JSON.stringify(data))
    return window.location.replace("/home")
  }

  async function handleLogin(event) {
    event.preventDefault();
    const data = {"username" : inputs.username, "password" : inputs.password}
    await axios.post(`/login/`, data)
      .then(response => {
        // console.log(response.data)
        login(response.data);
      })
      .catch(error => {
        window.alert("Wrong username or password. Note that both fields may be case-sensitive")
        // console.log(error)
      })
  }

	return (
		<div style={{display: "flex", height: "100vh"}}>
			<div className="login-sidebar">
				<h1 style={{textAlign: "left", fontSize: "40px"}}>login</h1>
				<form onSubmit={handleLogin} style={{width: "100%"}}>
					<input
						className='login-input'
						type="text"
						name="username"
						placeholder="Username"
						value={inputs.username || ""}
						required
						onChange={handleChange}
					/>
					<input
						className='login-input'
						type="password"
						name="password"
						placeholder="Password"
						value={inputs.password || ""}
						required
						onChange={handleChange}
					/>
					<div className='login-sign'>
						New account can be registered at the front desk.
					</div>
					<button type="submit">Login</button>
				</form>
			</div>
			<div className="login-poster">poster</div>
			{/* <img className="login-poster"></img> */}
		</div>
	);
}

export default Login;