import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from '@fullcalendar/interaction';
import configData from "../config";

import addMinutes from '../utils/addMinutes';
import addDays from '../utils/addDays';

import Navbar from '../components/Navbar';
import PopUp from '../components/PopUp';

import '../assets/Home.css';

const Home = () => {
	const dateOption = configData.DATE_OPTION;
	const timeOption = configData.TIME_OPTION;

	let [user, setUser] = useState(null)
	let [userData, setUserData] = useState('')
	let [reserve, setReserve] = useState([
		{ title: 'customer name', start: new Date(), end: addMinutes(new Date(), 30), note: "this is a note"},
		{ title: 'customer name', start: new Date(), end: addMinutes(new Date(), 30), note: "this is a note"},
		{ title: 'customer name', start: new Date(), end: addMinutes(new Date(), 30), note: ""},
		{ title: 'customer name', start: new Date(), end: addMinutes(new Date(), 30), note: "this is a note"},
		{ title: 'customer name', start: addDays(new Date(), 1), end: addMinutes(addDays(new Date(), 1), 30), note: ""},
		{ title: 'customer name', start: addDays(new Date(), 2), end: addMinutes(addDays(new Date(), 2), 30), note: "this is a note"},
		{ title: 'customer name', start: addDays(new Date(), 3), end: addMinutes(addDays(new Date(), 3), 30), note: "this is a note"}
	])
	let [selectReserve, setSelectReserve] = useState(null)
	let [selectReserveDate, setSelectReserveDate] = useState(reserve)

	const [value, onChange] = useState(new Date());

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')))
		// if (!user) {
    //   window.location.replace("/");
    // }
		// getUserData()
  }, []);

  async function getUserData() {
    await axios.get(`/user/${user}`)
      .then(response => {
        console.log(response.data)
				setUserData(response.data)
      })
      .catch(error => {
        window.alert(error)
        // console.log(error)
      })
  }

	function handleSelectReserve(reserve) {
		if (reserve !== selectReserve) {
			setSelectReserve(reserve)
		} else {
			setSelectReserve(null)
		}
	}

	function handleDateSelect(info) {
		let tempReserve = reserve.filter(x => 
			x.start.toISOString().substr(0, 10) >= info.startStr &&
			x.start.toISOString().substr(0, 10) < info.endStr)
		if (tempReserve.length > 0) {
			setSelectReserveDate(tempReserve)
		} else {
			setSelectReserveDate(reserve)
		}
	}

	function renderEventContent(eventInfo) {
		return (
			<div style={{textAlign: "center", fontWeight: "bolder"}}>{eventInfo.timeText}</div>
		)
	}

	return (
		<div>
			<Navbar user={user}/>
			<div className="home-sidebar">
				<div style={{justifyContent: "space-between", display: "flex", fontSize: "20px"}}>
					<div>Total Course</div>
					<div>{100} Hour</div>
				</div>
				<p>Reservations</p>
				<hr />
				<div className="home-sidebar-table">
					<table>
						<tbody>{selectReserveDate.map((reserve, index) => {
							return (
								<tr key={index}>
									<td><div onClick={() => handleSelectReserve(reserve)}
										className={reserve === selectReserve ? "reserve-select" : "reserve-div"}>
										<div style={{fontSize: "20px", fontWeight: "500"}}>
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
				<PopUp msg={{title: "Cancel Reservation", detail: selectReserve}}/>
			</div>
			<FullCalendar
				plugins={[ dayGridPlugin, InteractionPlugin ]}
				initialView="dayGridMonth"
				events={reserve}
				headerToolbar={{
					start: "prev",
					center: "title",
					right: "next",
				}}
				eventColor={configData.COLOR.GREEN}
				eventDisplay="block"
				displayEventEnd
				businessHours={{
					daysOfWeek: configData.BUSINESS_HOURS,
				}}
				eventTimeFormat={{
					hour: 'numeric',
					minute: '2-digit',
					meridiem: "lowercase"
				}}
				dayMaxEventRows={3}
				validRange={{
					start: new Date().toISOString().substr(0, 8) + "01",
					end: addDays(new Date(), 42).toISOString().substr(0, 10)
				}}
				selectable
				select={handleDateSelect}
				eventContent={renderEventContent}
			/>
		</div>
	);
}

export default Home;