import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import configData from "../config";

import '../assets/Auth.css';

const AdminSignup = () => {
	const navigate = useNavigate();
	let user = JSON.parse(sessionStorage.getItem('user'))
	const [inputs, setInputs] = useState({
		"username": "",
		"password": "",
		"name": "",
		"surname": "",
		"email": "",
		"phone": "",
		"address": "",
		"note": "",
	});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  async function handleLogin(data) {
    await axios.post(configData.API.LOGIN, data)
      .then(response => {
        sessionStorage.setItem('user', JSON.stringify(response.data));
		return window.location.replace("/home")
      })
      .catch(error => {
        window.alert("Wrong username or password. Note that both fields may be case-sensitive")
        console.log(error)
      })
  }

  async function handleSignup(event) {
    event.preventDefault();
		if (inputs.password === inputs.passwordCon) {
			delete inputs.passwordCon
			await axios.post(configData.API.SIGNUP, inputs)
				.then(response => {
					if(typeof(response.data) == "string") {
						window.alert(response.data)
					} else {
						window.alert("Success, account have been created.")
						if(user && user.user.is_staff) {
							return window.location.replace("/reservation")
						}
						handleLogin({username: inputs.username, password: inputs.password})
					}
				})
				.catch(error => {
					window.alert(error)
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
					<input
						type="password"
						name="passwordCon"
						placeholder="Password"
						value={inputs.passwordCon || ""}
						required
						onChange={handleChange}
					/>
					<input
						type="text"
						name="name"
						placeholder="Name"
						value={inputs.name || ""}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="surname"
						placeholder="Surname"
						value={inputs.surname || ""}
						onChange={handleChange}
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={inputs.email || ""}
						required
						onChange={handleChange}
					/>
					<input
						type="tel"
						// pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
						maxLength={configData.PHONE_MAX}
						name="phone"
						placeholder="Phone"
						value={inputs.phone || ""}
						onChange={handleChange}
					/>
					<textarea
						rows="5"
						type="text"
						name="address"
						placeholder="Address"
						value={inputs.address || ""}
						onChange={handleChange}
					/>
					<textarea
						rows="3"
						type="text"
						name="note"
						placeholder="Note"
						value={inputs.note || ""}
						onChange={handleChange}
					/>
					<div className='auth-sign'>
						Already have an account <Link to={"/"}>Login</Link>
					</div>
					<button type="submit">Signup</button>
					{user&&<button type="button" onClick={() => navigate(-1)}
						style={{marginLeft:"20%", background:"gray"}}>Cancel</button>}
				</form>
			</div>
			<div className="auth-poster">poster</div>
			{/* <img className="auth-poster"></img> */}
		</div>
	);
}

export default AdminSignup;