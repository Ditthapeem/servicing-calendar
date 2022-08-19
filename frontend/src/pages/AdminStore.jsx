import React, { useState, useEffect } from "react";
import axios from "axios";
import configData from "../config";

import AdminNavbar from '../components/AdminNavbar';

import '../assets/Store.css'

const AdminCustomer = () => {
	let user = JSON.parse(sessionStorage.getItem('user'))
	const [inputs, setInputs] = useState({});

	useEffect(() => {
		async function getStore() {
			await axios.get(configData.API.STORE, {
				headers:{'Authorization':'Token '+ user.token}
				})
				.then(response => {
					// if(typeof(response.data) === "string") {
					// 	window.alert(response.data)
					// }
					console.log(response.data);
					setInputs(response.data)
				})
				.catch(error => {
					window.alert(error)
				})
		}

		getStore()
  }, [user.token]);

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}

	async function handleUpdateStore(event) {
		event.preventDefault();
		await axios.post(configData.API.STORE, inputs, {
			headers:{'Authorization':'Token '+ user.token}
			})
			.then(response => {
				window.alert(response.data)
			})
			.catch(error => {
				window.alert(error)
			})
		}

	return (
		<div style={{textAlign: "center"}}>
			<AdminNavbar user={user}/>
			<h1 style={{marginTop: "80px"}}>Store Management</h1>
			<div className="store">	
				{Object.keys(inputs).length > 0 && 
				<form onSubmit={handleUpdateStore}>
					<div>
						<label>Info: 
							<textarea
								style={{resize: "vertical"}}
								rows="5"
								type="text"
								name="info"
								placeholder="Info"
								value={inputs.info || ""}
								onChange={handleChange}
							/>
						</label>
					</div>
					<div>
						<label>Address: 
							<textarea
								style={{resize: "vertical"}}
								rows="5"
								type="text"
								name="address"
								placeholder="Address"
								value={inputs.address || ""}
								onChange={handleChange}
							/>
						</label>
						<label>Address Url: 
							<input
								type="url"
								name="addressUrl"
								placeholder="Address Url"
								value={inputs.addressUrl || ""}
								onChange={handleChange}
							/>
						</label>
					</div>
					<div>
						<label>Open: 
							<input
								type="time"
								name="open"
								placeholder="Open"
								value={inputs.open || ""}
								onChange={handleChange}
							/>
						</label>
						<label>Close: 
							<input
								type="time"
								name="close"
								placeholder="Close"
								value={inputs.close || ""}
								onChange={handleChange}
							/>
						</label>
					</div>
					<div>
						<label>Email: 
							<input
								type="email"
								name="email"
								placeholder="Email"
								value={inputs.email || ""}
								onChange={handleChange}
							/>
						</label>
						<label>Note: 
							<input
								type="tel"
								// pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
								maxLength={configData.PHONE_MAX}
								name="phone"
								placeholder="Phone"
								value={inputs.phone || ""}
								onChange={handleChange}
							/>
						</label>
					</div>
					<button type="submit">Save</button>
				</form>}
			</div>
		</div>
	);
}

export default AdminCustomer;