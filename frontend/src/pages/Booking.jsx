import React, { useState, useEffect } from "react";
import axios from "axios";

import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import PopUp from '../components/PopUp';
import configData from "../config";

import addDays from '../utils/addDays';

import '../assets/Booking.css';

const Booking = () => {
	const selectColor = configData.COLOR.YELLOW;
	const weekday = configData.WEEKDAY;
	const monthNames = configData.MONTH_NAME;
	const timeOption = configData.TIME_OPTION;
	const course = configData.COURSE;

	let user = JSON.parse(sessionStorage.getItem('user'))
	let [availableDate, setAvailableDate] = useState([])
	let [availableType, setAvailableType] = useState([])
	let [date, setDate] = useState(createWeek(addDays(new Date(), 0)))
	let [time, setTime] = useState([])
	let [select, setSelect] = useState({})
	let customer = sessionStorage.getItem('customer')

	useEffect(() => {
		async function getDate() {
			await axios.get(configData.API.BOOKING, {
				headers:{'Authorization':'Token '+ user.token}
				})
				.then(response => {
					setAvailableDate(response.data[2].available)
				})
				.catch(error => {
					window.alert(error)
				})
		}
	
		async function getType() {
			await axios.get(configData.API.BOOKING_TYPE, {
				headers:{'Authorization':'Token '+ user.token}
				})
				.then(response => {
					console.log(response.data);
					setAvailableType(response.data)
				})
				.catch(error => {
					window.alert(error)
				})
		}

		getDate()
		getType()
  }, [user.token]);

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setSelect(values => ({...values, [name]: value}))
	}

	async function getTime(date, course) {
	if(date && course) {
		await axios.get(configData.API.BOOKING + `date=${date}/course=${course}`, {
			headers:{'Authorization':'Token '+ user.token}
			})
		.then(response => {
			setTime(response.data)
		})
		.catch(error => {
			window.alert(error)
		})
	}
  }

	function createWeek(startDate) {
		let dateList = []
		for (let i = 0; i < 7; i++) {
			dateList.push(addDays(startDate, i));
		}
		return dateList
	}

	function handleDateNext(days) {
		let nextDate = addDays(date[0], days)
		if (nextDate > new Date() && nextDate < addDays(new Date(), 42)) {
			setDate([...createWeek(nextDate)]);
		}
	}

	function handleSelect(type, data) {
		let tempSelect = select
		if (type in tempSelect) {
			data !== tempSelect[type] ? tempSelect[type] = data : delete tempSelect[type];
		} else {
			tempSelect[type] = data
		}
		setSelect({...tempSelect})
	}

	return (
		<div>
			{user.user.is_staff? <AdminNavbar user={user}/> : <Navbar user={user}/>}
			<div className="booking">
				<h1>Booking</h1>
				{customer && <p>Customer: {customer}</p>}
				<table>
					<tbody>
						{availableDate.length > 0 && <tr>
							<td>Select Date</td>
							<td className="booking-date"><div style={{justifyContent: "space-between", display: "flex"}}>
								<button onClick={() => handleDateNext(-7)} style={{fontSize: "20px", background: "none"}}>{"<"}</button>
								{date.map((date, index) => {
									return (
										<button key={index} onClick={() => {handleSelect("date", date.toISOString().substr(0, 10)); getTime(date.toISOString().substr(0, 10), select.course)}}
										disabled={availableDate.includes(date.toISOString().substr(0, 10))?false:true}
											style={{background: date.toISOString().substr(0, 10) === select.date && selectColor}}>
											<div style={{fontSize: "14px"}}>{weekday[date.getDay()]}</div>
											<div style={{fontSize: "20px", fontWeight: "bold"}}>{date.getDate()}</div>
											<div style={{fontSize: "14px"}}>{monthNames[date.getMonth()]}</div>
										</button>
									);
								})}
								<button onClick={() => handleDateNext(7)} style={{fontSize: "20px", background: "none"}}>{">"}</button>
							</div></td>
						</tr>}
						{select.hasOwnProperty("date") && <tr>
							<td>Select Durations</td>
							<td className="booking-course"><div style={{justifyContent: "space-between", display: "flex"}}>
								{course.map((course, index) => {
									return (
										<button key={index} onClick={() => {handleSelect("course", course); getTime(select.date, course)}}
											style={{background: course === select.course && selectColor}}>
											{course}
										</button>
									);
								})}
								<div style={{width: "100px"}}> Minutes</div>
							</div></td>
						</tr>}
						{select.hasOwnProperty("date") && select.hasOwnProperty("course") && time.length > 0 && <tr>
							<td>Select Time</td>
							<td className="booking-time"><div>
								{time.map((time, index) => {
									return (
										<button key={index} onClick={() => {handleSelect("start", time.start); handleSelect("end", time.end)}}
											style={{background: time.start === select.start && selectColor}}>
											{new Date(time.start).toLocaleTimeString([], timeOption)} - {new Date(time.end).toLocaleTimeString([], timeOption)}
										</button>
									);
								})}
							</div></td>
						</tr>}
						{select.hasOwnProperty("date") && select.hasOwnProperty("course") && select.hasOwnProperty("start") && <tr>
							<td>Select Massage Type</td>
							<td className="booking-time"><div>
								{availableType.map((type, index) => {
									return (
										<button key={index} onClick={() => {handleSelect("type", type.massage_type)}}
											style={{background: type.massage_type === select.type && selectColor}}>
											{type.massage_type}
										</button>
									);
								})}
							</div></td>
						</tr>}
						{select.hasOwnProperty("date") && select.hasOwnProperty("course") && select.hasOwnProperty("start") && select.hasOwnProperty("type") && <tr>
							<td>Note</td>
							<td><textarea
								style={{width: "100%", background: configData.COLOR.GRAY}}
								rows="3"
								type="text"
								name="note"
								placeholder="Note"
								value={select.note || ""}
								onChange={handleChange}
							/></td>
						</tr>}
					</tbody>
				</table>
				{select.hasOwnProperty("date") && select.hasOwnProperty("course") && select.hasOwnProperty("start") &&
				<PopUp msg={{type: "booking", title: "Confirm Booking", detail: select}} user={user}/>}
			</div>
		</div>
	);
}

export default Booking;