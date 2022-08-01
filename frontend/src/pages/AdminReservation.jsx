import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from '@fullcalendar/interaction';
import configData from "../config";

import addMinutes from '../utils/addMinutes';
import addDays from '../utils/addDays';

import AdminNavbar from '../components/AdminNavbar';
import PopUp from '../components/PopUp';

import '../assets/Home.css';

const AdminReservation = () => {
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
	let [selectDate, setSelectDate] = useState(null)
	let [selectReserveDate, setSelectReserveDate] = useState(reserve.filter(x => 
		x.start.toISOString().substr(0, 10) === (new Date()).toISOString().substr(0, 10)))

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')))
		// if (!user) {
    //   window.location.replace("/");
    // }
		// getUserData()
		// getReserve()
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

	// async function getReserve() {
  //   await axios.get(`/reserve/${date}`)
  //     .then(response => {
  //       console.log(response.data)
	// 			setUserData(response.data)
  //     })
  //     .catch(error => {
  //       window.alert(error)
  //       // console.log(error)
  //     })
  // }

	function handleSelectReserve(reserve) {
		if (reserve !== selectReserve) {
			setSelectReserve(reserve)
		} else {
			setSelectReserve(null)
		}
	}

	function handleDateClick(info) {
		console.log(info.date)
		setSelectDate(info.date)
	}

	function handleDateSelect(info) {
		let tempReserve = reserve.filter(x => 
			x.start.toISOString().substr(0, 10) >= info.startStr &&
			x.start.toISOString().substr(0, 10) < info.endStr)
		if (tempReserve.length === 0) {
			tempReserve = reserve.filter(x => 
				x.start.toISOString().substr(0, 10) === (new Date()).toISOString().substr(0, 10))
		}
		setSelectReserveDate(tempReserve)
	}

	function renderEventContent(eventInfo) {
		return (
			<>
				<b style={{paddingRight: "2px"}}>{eventInfo.timeText}</b>
				<small>{eventInfo.event.title}</small>
			</>
		)
	}

	return (
		<div>
			<AdminNavbar user={user}/>
			<div className="home-sidebar">
				<p>Reservations</p>
				<hr />
				<div className="home-sidebar-table">
					{selectReserveDate.length === 0 && <p>Select reservation date</p>}
					<table>
						<tbody>{selectReserveDate.map((reserve, index) => {
							return (
								<tr key={index}>
									<td><div onClick={() => handleSelectReserve(reserve)}
										className={reserve === selectReserve ? "reserve-select" : "reserve-div"}>
										<div style={{fontSize: "20px", fontWeight: "500"}}>
											<b>{reserve.title}</b><br/>
											{new Date(reserve.start).toLocaleDateString("en-GB", dateOption)}<br/>
											{new Date(reserve.start).toLocaleTimeString([], timeOption) + " - " +
												new Date(reserve.end).toLocaleTimeString([], timeOption)}
										</div>
										{reserve.note && <div style={{fontSize: "18px", textAlign: "left"}}>{reserve.note}</div>}
									</div></td>
								</tr>
							);
						})}</tbody>
					</table>
				</div>
				<div style={{justifyContent: "space-around", display: "flex"}}>
					<PopUp msg={{title: "Cancel Reservation", detail: selectReserve}}/>
					<PopUp msg={{title: "Close Store", detail: selectDate}}/>
				</div>
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
					meridiem: false
				}}
				dayMaxEventRows={3}
				selectable
				dateClick={handleDateClick}
				select={handleDateSelect}
				eventContent={renderEventContent}
			/>
		</div>
	);
}

export default AdminReservation;