import React, { useState, useEffect } from "react";
import axios from "axios";
import configData from "../config";

import AdminNavbar from '../components/AdminNavbar';

import '../assets/Manage.css'

import PopUp from "../components/PopUp";

const AdminCustomer = () => {
	let user = JSON.parse(sessionStorage.getItem('user'))
	const dateOption = configData.DATE_OPTION;
	const timeOption = configData.TIME_OPTION;
	let [reserve, setReserve] = useState(null)
	let [selectReserve, setSelectReserve] = useState(null)
	const [inputs, setInputs] = useState({});
	const [historyReserve, setHistoryReserve] = useState(null);

	useEffect(() => {
		if(sessionStorage.getItem("customer")) {
			setInputs({customer:sessionStorage.getItem("customer")})
			getCustomerData(sessionStorage.getItem("customer"))
			getCustomerReserve(sessionStorage.getItem("customer"))
		}
    }, []);

  	function handleSelectReserve(reserve) {
		if (reserve !== selectReserve) {
			let data = {
				id: String(reserve.id),
				note: reserve.note
			}
			setSelectReserve(reserve)
			setHistoryReserve(data)
		} else {
			setSelectReserve(null)
			setHistoryReserve(null)
		}
	}

	async function getCustomerReserve(customer) {
		await axios.get(configData.API.HISTORY + customer, {
			headers:{'Authorization':'Token '+ user.token}
			})
			.then(response => {
				if(typeof(response.data) === "string") {
					window.alert(response.data)
					setReserve(null)
				} else {
					setReserve(response.data)
				}
				setHistoryReserve(null)
				setSelectReserve(null)		
			})
			.catch(error => {
				window.alert(error)
			})
	}

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}

	function handleHistoryChange(event){
		const name = event.target.name;
		const value = event.target.value;
		setHistoryReserve(values => ({...values, [name]: value}))
	}

	async function getCustomerData(customer) {
		await axios.get(configData.API.CUSTOMER + customer, {
				headers:{'Authorization':'Token '+ user.token}
				})
		  .then(response => {
			if(typeof(response.data) === "string") {
				setInputs({})
			} else {
				let data = response.data
				delete data.id
				delete data.username 
				setInputs(values => ({...data, ["customer"]:values.customer}))
			}
		  })
		  .catch(error => {
			window.alert(error)
		  })
	}

	function handleCustomerSearch(event) {
		event.preventDefault();
		getCustomerData(inputs.customer)
		getCustomerReserve(inputs.customer)
	}

	  async function handleCustomerEditData(event) {
		event.preventDefault();
		let data = {
			name : inputs.name,
			surname : inputs.surname,
			email : inputs.email,
			phone : String(inputs.phone),
			address : inputs.address,
			note : inputs.note
		}
		await axios.post(configData.API.CUSTOMER + inputs.customer, data, {
			headers:{'Authorization':'Token '+ user.token}
			})
			.then(response => {
				window.alert(response.data)
				getCustomerData(inputs.customer)
			})
			.catch(error => {
				window.alert(error)
			})
	}

	async function handleHistoryEditData(event) {
		event.preventDefault();
		await axios.post(configData.API.HISTORY + inputs.customer, historyReserve, {
			headers:{'Authorization':'Token '+ user.token}
			})
			.then(response => {
				window.alert(response.data)
				getCustomerReserve(inputs.customer)
			})
			.catch(error => {
				window.alert(error)
			})
		}

		function handleBooking() {
			if (inputs.customer) {
				sessionStorage.setItem('customer', inputs.customer)
				window.location.assign("/booking")
			} else {
				window.alert("Select Customer")
			}
		}

	return (
		<div style={{display: "flex", height: "100vh"}}>
			<AdminNavbar user={user}/>
			<div className="manage-sidebar">
				<form onSubmit={handleCustomerSearch} style={{width: "100%"}} className="manage-username-input">
					<div className="set-label">
					<input
						type="text"
						name="customer"
						placeholder="Customer username"
						value={inputs.customer || ""}
						required
						onChange={handleChange}
					/>
					<div className="manage-button"><button type="submit">Search</button></div></div>
				</form>
				{!reserve?<p>Search customer by username</p>:
				<div>
					<p>Reservations</p>
					<hr />
					<div className="manage-sidebar-table">
						<table>
							<tbody>{reserve.map((reserve, index) => {
								return (
									<tr key={index}>
										<td><div onClick={() => handleSelectReserve(reserve)}
											className={reserve === selectReserve ? "reserve-select" :
												reserve.confirmation?"reserve-confirm-div":"reserve-not-confirm-div"}>
											<div style={{fontSize: "20px", fontWeight: "500"}}>
												{ reserve.confirmation?<>Reservation Confirmed</>:<>Waiting For confirmation</> }<br/>
												{reserve.massage_type}<br/>
												{new Date(reserve.start).toLocaleDateString("en-GB", dateOption)}<br/>
												{new Date(reserve.start).toLocaleTimeString([], timeOption) + " - " +
													new Date(reserve.end).toLocaleTimeString([], timeOption)}
											</div>
										</div></td>
									</tr>
								);
							})}</tbody>
						</table>
					</div>
					<div style={{justifyContent: "space-around", display: "flex"}}>
						<PopUp msg={{type: "cancel", title: "Delete Reservation", detail: selectReserve}} user={user}/>
						<PopUp msg={{type: "confirm", title: "Confirm Reservation", detail: selectReserve}} user={user}/>
					</div>
						<button onClick={()=>{handleBooking()}} >Booking</button>
				</div>}
			</div>
			<div className="manage-body">	
				<h1>Customer Management</h1>
				{inputs.email && <form onSubmit={handleCustomerEditData} className="manage-customer">
					<div className="set-label">
						<div className="container">
							<label>Name: 
								<input
									type="text"
									name="name"
									placeholder="Name"
									value={inputs.name || ""}
									onChange={handleChange}
								/>
							</label>
							<label>Surname: 
								<input
									type="text"
									name="surname"
									placeholder="Surname"
									value={inputs.surname || ""}
									onChange={handleChange}
								/>
							</label></div>
						<div className="container">
							<label>Email: 
								<input
									type="email"
									name="email"
									placeholder="Email"
									value={inputs.email || ""}
									required
									onChange={handleChange}
								/>
							</label>
							<label>Mobile number: 
								<input
									type="tel"
									// pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
									maxLength={configData.PHONE_MAX}
									name="phone"
									placeholder="Phone"
									value={inputs.phone || ""}
									onChange={handleChange}
								/>
							</label></div>
						<div className="container">
							<label>Address: 
								<textarea
									rows="5"
									type="text"
									name="address"
									placeholder="Address"
									value={inputs.address || ""}
									onChange={handleChange}
								/>
							</label></div>
						<div className="container">
							<label>Note: 
								<textarea
									rows="3"
									type="text"
									name="note"
									placeholder="Note"
									value={inputs.note || ""}
									onChange={handleChange}
								/>
							</label>
						</div>
					</div>
					<button type="submit">Save</button>
				</form>}
				{inputs.email && <div className="reserve-history-body">
					{selectReserve ?
						<form onSubmit={handleHistoryEditData} 
							className={selectReserve.confirmation?"reserve-confirm-div":"reserve-not-confirm-div"}>
							<div style={{justifyContent: "space-around", display: "flex",fontSize: "20px", fontWeight: "500"}}>
								<p>{new Date(selectReserve.start).toLocaleDateString("en-GB", dateOption)}</p>
								<p>{new Date(selectReserve.start).toLocaleTimeString([], timeOption) + " - " +
									new Date(selectReserve.end).toLocaleTimeString([], timeOption)}</p>
								<p>Massage Type: {selectReserve.massage_type}</p>
							</div>
							<textarea
								rows="3"
								type="text"
								name="note"
								placeholder="Note"
								value={historyReserve.note || ""}
								onChange={handleHistoryChange}
							/>
							<button type="submit">Save</button>
						</form>:
						<p>Select Reservation</p>}
				</div>}
			</div>
		</div>
	);
}

export default AdminCustomer;