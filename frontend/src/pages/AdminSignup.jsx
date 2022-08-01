import React, { useState } from "react";
import axios from 'axios';

import configData from "../config";

import '../assets/Auth.css';

const AdminSignup = () => {
	const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  async function signup(data) {
		if (inputs.password === inputs.passwordCon) {
			sessionStorage.setItem('user', JSON.stringify(data))
    	return window.location.replace("/reservation")
		} else {
			window.alert("Password do not match")
		}
  }

  async function handleSignup(event) {
    event.preventDefault();
		if (inputs.password === inputs.passwordCon) {
			const data = {"username" : inputs.username, "password" : inputs.password}
			await axios.post(`/signup/`, data)
				.then(response => {
					// console.log(response.data)
					window.alert(response.data)
				})
				.catch(error => {
					window.alert(error)
					// console.log(error)
				})
		} else {
			window.alert("Password do not match")
		}
  }

	return (
		<div style={{display: "flex", height: "100vh"}}>
			<div className="auth-sidebar">
				<h1 style={{textAlign: "left", fontSize: "40px"}}>Signup</h1>
				<form onSubmit={handleSignup} style={{width: "100%"}}>
					<input
						className='auth-input'
						type="text"
						name="username"
						placeholder="Username"
						value={inputs.username || ""}
						required
						onChange={handleChange}
					/>
					<input
						className='auth-input'
						type="password"
						name="password"
						placeholder="Password"
						value={inputs.password || ""}
						required
						onChange={handleChange}
					/>
					<input
						className='auth-input'
						type="password"
						name="passwordCon"
						placeholder="Password"
						value={inputs.passwordCon || ""}
						required
						onChange={handleChange}
					/>
					<input
						className='auth-input'
						type="text"
						name="name"
						placeholder="Name"
						value={inputs.name || ""}
						onChange={handleChange}
					/>
					<input
						className='auth-input'
						type="text"
						name="surname"
						placeholder="Surname"
						value={inputs.surname || ""}
						onChange={handleChange}
					/>
					<input
						className='auth-input'
						type="email"
						name="email"
						placeholder="Email"
						value={inputs.email || ""}
						onChange={handleChange}
					/>
					<input
						className='auth-input'
						type="tel"
						// pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
						maxlength={configData.PHONE_MAX}
						name="phone"
						placeholder="Phone"
						value={inputs.phone || ""}
						onChange={handleChange}
					/>
					<textarea
						style={{resize: "vertical"}}
						className='auth-input'
						rows="10"
						type="text"
						name="address"
						placeholder="Address"
						value={inputs.address || ""}
						onChange={handleChange}
					/>
					<button type="submit">Signup</button>
				</form>
			</div>
			<div className="auth-poster">poster</div>
			{/* <img className="auth-poster"></img> */}
		</div>
	);
}

export default AdminSignup;