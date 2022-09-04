import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import configData from "../config";

import '../assets/Auth.css';

const Signup = () => {
	let imgs = ["img/img1.jpg", "img/img2.jpg", "img/img3.jpg", "img/img4.jpg", "img/img5.jpg"]
	let [img, setImag] = useState(imgs[imgs.length-1])

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

	useLayoutEffect(() => {
		if (user && !user.user.is_staff) {
      window.location.replace("/home");
    }
	}, []);

	useEffect(() => {
		const interval = setInterval(()=>{
			let imgT = imgs.shift()
			imgs.push(imgT)
			setImag(imgT)
		}, 5000);
		return () => clearInterval(interval);
	}, []);

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
						if(user && user.user.is_staff) {
							window.alert("Success, account have been created.")
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
			setInputs(values => ({...values, "passwordCon": ""}))
		}
  }

	return (
		<div style={{display: "flex", height: "100vh"}}>
			<div className="auth-sidebar">
				<img src={"./Logo2.jpeg"} alt="Logo" style={{borderRadius: "8px"}}/>
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
						placeholder="Confirm Password"
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
						rows="4"
						type="text"
						name="address"
						placeholder="Address"
						value={inputs.address || ""}
						onChange={handleChange}
					/>
					{!user && <div className='auth-sign'>
						Already have an account <Link to={"/"}>Login</Link>
					</div>}
					<button type="submit" style={{marginBottom:"10%"}}>Signup</button>
					{user && <button type="button" onClick={() => navigate(-1)}
						style={{marginLeft:"20%", background: configData.COLOR.RED}}>Cancel</button>}
				</form>
			</div>
			<img src={img} alt="poster" className="auth-poster"/>
		</div>
	);
}

export default Signup;