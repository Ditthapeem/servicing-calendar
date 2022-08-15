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
	let [reserve, setReserve] = useState([])
	let [selectReserve, setSelectReserve] = useState(null)
	let [customer, setCustomer] = useState([])
	let [selectCustomer, setSelectCustomer] = useState(null) 
	const [inputs, setInputs] = useState({});
	const [historyReserve, setHistoryReserve] = useState(null);

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

	async function getCustomerReserve() {
		await axios.get(configData.API.HISTORY + inputs.customer, {
			headers:{'Authorization':'Token '+ user.token}
			})
			.then(response => {
				setReserve(response.data)
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

	async function getCustomerData(event) {
		event.preventDefault();
		await axios.get(configData.API.CUSTOMER + inputs.customer, {
				headers:{'Authorization':'Token '+ user.token}
				})
		  .then(response => {
			console.log(response.data)
			let data = response.data
			delete data.id
			delete data.username 
			setInputs(values => ({...data, ["customer"]:values.customer}))
			getCustomerReserve()
		  })
		  .catch(error => {
			window.alert(error)
		  })
	}

	  async function handleCustomerEditData(event) {
		event.preventDefault();
		let data = {
			name : inputs.name,
			surname : inputs.surname,
			email : inputs.email,
			phone : inputs.phone,
			address : inputs.address,
			note : inputs.note
		}
		await axios.post(configData.API.CUSTOMER + inputs.customer, data, {
			headers:{'Authorization':'Token '+ user.token}
			})
			.then(response => {
				window.alert(response.data)
				window.location.reload()
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
				getCustomerReserve()
			})
			.catch(error => {
				window.alert(error)
			})
		}

	return (
		<div style={{display: "flex",height: "100vh"}}>
			<AdminNavbar user={user}/>
			<div className="manage-sidebar">
				<form onSubmit={getCustomerData} style={{width: "100%"}}>
					<input
							type="text"
							name="customer"
							placeholder="Customer username"
							value={inputs.customer || ""}
							required
							onChange={handleChange}
					/>
				</form>
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
					<PopUp msg={{title: "Cancel Reservation", detail: selectReserve}} user={user}/>
					<PopUp msg={{title: "Confirm Reservation", detail: selectReserve}} user={user}/>
				</div>
			</div>
			<div className="manage-body">	
			<form onSubmit={handleCustomerEditData} className="manage-customer-input">
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
						required
						onChange={handleChange}
					/>
					<input
						className='auth-input'
						type="tel"
						// pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
						maxLength={configData.PHONE_MAX}
						name="phone"
						placeholder="Phone"
						value={inputs.phone || ""}
						onChange={handleChange}
					/>
					<textarea
						style={{resize: "vertical"}}
						className='auth-input'
						rows="5"
						type="text"
						name="address"
						placeholder="Address"
						value={inputs.address || ""}
						onChange={handleChange}
					/>
					<textarea
						style={{resize: "vertical"}}
						className='auth-input'
						rows="3"
						type="text"
						name="note"
						placeholder="Note"
						value={inputs.note || ""}
						onChange={handleChange}
					/>
					<button type="submit">Save</button>
				</form>
				<div className="reserve-history-body">
				{selectReserve?<form onSubmit={handleHistoryEditData} 
					className={selectReserve.confirmation?"reserve-confirm-div":"reserve-not-confirm-div"}>
					<div style={{justifyContent: "space-around", display: "flex",fontSize: "20px", fontWeight: "500"}}>
						<p>{new Date(selectReserve.start).toLocaleDateString("en-GB", dateOption)}</p>
						<p>{new Date(selectReserve.start).toLocaleTimeString([], timeOption) + " - " +
							new Date(selectReserve.end).toLocaleTimeString([], timeOption)}</p>

					</div>
					<textarea
						style={{resize: "vertical"}}
						className='auth-input'
						rows="3"
						type="text"
						name="note"
						placeholder="Note"
						value={historyReserve.note || ""}
						onChange={handleHistoryChange}
					/>
					<button type="submit">Save</button>
				</form>:<p>Select Reservation</p>}
				</div>
			</div>
		</div>
		
	);
}

export default AdminCustomer;