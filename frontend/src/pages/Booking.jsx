import React, { useState, useEffect } from "react";
import axios from "axios";

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
	const course = configData.COURSE;

	let user = JSON.parse(sessionStorage.getItem('user'))
	let [availableDate, setAvailableDate] = useState([])
	let [date, setDate] = useState(createWeek(addDays(new Date(), 1)))
	let [time, setTime] = useState([])
	let [select, setSelect] = useState({})

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

		getDate()
  }, [user.token]);

	async function getTime(date, course) {
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
		if(tempSelect.hasOwnProperty("date") && tempSelect.hasOwnProperty("course")) {
			getTime(tempSelect.date, tempSelect.course)
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
						{availableDate.length>0 && <tr>
							<td>Select Date</td>
							<td className="booking-date"><div style={{justifyContent: "space-between", display: "flex"}}>
								<button onClick={() => handleSelect("date", new Date().toISOString().substr(0, 10))}
									disabled={availableDate.includes((new Date()).toISOString().substr(0, 10))?false:true}
									style={{background: (new Date()).toISOString().substr(0, 10) === select.date && selectColor}}>
									<div style={{fontSize: "14px"}}>{weekday[(new Date()).getDay()]}</div>
									<div style={{fontSize: "20px", fontWeight: "bold"}}>{(new Date()).getDate()}</div>
									<div style={{fontSize: "14px"}}>{monthNames[(new Date()).getMonth()]}</div>
								</button>
								<button onClick={() => handleDateNext(-7)} style={{fontSize: "20px", background: "none"}}>{"<"}</button>
								{date.map((date, index) => {
									return (
										<button key={index} onClick={() => handleSelect("date", date.toISOString().substr(0, 10))}
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
							<td>Select Course</td>
							<td className="booking-course"><div style={{justifyContent: "space-between", display: "flex"}}>
								{course.map((course, index) => {
									return (
										<button key={index} onClick={() => handleSelect("course", course)}
											style={{background: course === select.course && selectColor}}>
											{course}
										</button>
									);
								})}
								<div style={{width: "100px"}}> Hour</div>
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
					</tbody>
				</table>
				{select.hasOwnProperty("date") && select.hasOwnProperty("course") && select.hasOwnProperty("start") &&
				<PopUp msg={{title: "Confirm Booking", detail: select}} user={user}/>}
			</div>
		</div>
	);
}

export default Booking;