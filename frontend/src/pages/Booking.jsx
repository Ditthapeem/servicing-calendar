import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import PopUp from '../components/PopUp';
import configData from "../config";

import addDays from '../utils/addDays';

import '../assets/Booking.css';

const Booking = () => {
	const selectColor = configData.COLOR.YELLOW;
	const weekday = configData.WEEKDAY;
	const monthNames = configData.MONTH_NAME;
	const timeOption = configData.TIME_OPTION;

	const course = [60, 15, 80]
	let [user, setUser] = useState(null)
	let [date, setDate] = useState(createWeek(addDays(new Date(), 1)))
	let [time, setTime] = useState(createWeek(addDays(new Date(), 1)))
	let [select, setSelect] = useState({})

	useEffect(() => {
		setUser(JSON.parse(sessionStorage.getItem('user')))
		// if (!user) {
    //   window.location.replace("/");
    // }
		// getUserData()
  }, []);

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
			<Navbar user={user}/>
			<div className="booking">
				<h1>Booking</h1>
				<table>
					<tbody>
						<tr>
							<td>Select Date</td>
							<td className="booking-date"><div style={{display: "flex", justifyContent: "center"}}>
								<button onClick={() => handleSelect("date", new Date().toDateString())}
									style={{background: (new Date()).toDateString() === select.date && selectColor}}>
									<div style={{fontSize: "14px"}}>{weekday[(new Date()).getDay()]}</div>
									<div style={{fontSize: "20px", fontWeight: "bold"}}>{(new Date()).getDate()}</div>
									<div style={{fontSize: "14px"}}>{monthNames[(new Date()).getMonth()]}</div>
								</button>
								<button onClick={() => handleDateNext(-7)} style={{fontSize: "20px", background: "none"}}>{"<"}</button>
								{date.map((date, index) => {
									return (
										<button key={index} onClick={() => handleSelect("date", date.toDateString())}
											style={{background: date.toDateString() === select.date && selectColor}}>
											<div style={{fontSize: "14px"}}>{weekday[date.getDay()]}</div>
											<div style={{fontSize: "20px", fontWeight: "bold"}}>{date.getDate()}</div>
											<div style={{fontSize: "14px"}}>{monthNames[date.getMonth()]}</div>
										</button>
									);
								})}
								<button onClick={() => handleDateNext(7)} style={{fontSize: "20px", background: "none"}}>{">"}</button>
							</div></td>
						</tr>
						<tr>
							<td>Select Course</td>
							<td className="booking-course"><div>
								{course.map((course, index) => {
									return (
										<button key={index} onClick={() => handleSelect("course", course)}
											style={{background: course === select.course && selectColor}}>
											{course}
										</button>
									);
								})}
								Hour
							</div></td>
						</tr>
						<tr>
							<td>Select Time</td>
							<td className="booking-time"><div>
								{time.map((time, index) => {
									return (
										<button key={index} onClick={() => handleSelect("time", time.toTimeString())}
											style={{background: time.toTimeString() === select.time && selectColor}}>
											{time.toLocaleTimeString([], timeOption)}
										</button>
									);
								})}
							</div></td>
						</tr>
					</tbody>
				</table>
				<PopUp msg={{title: "Confirm Booking", detail: select}}/>
			</div>
		</div>
	);
}

export default Booking;