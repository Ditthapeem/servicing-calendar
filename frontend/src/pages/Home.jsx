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
	let [reservation, setReservation] = useState([
		{ title: 'event 1', start: '2022-07-28T12:30:00', end: '2022-07-28T15:30:00'},
		{ title: 'event 2', start: '2022-07-29T12:30:00', end: '2022-07-29T15:30:00'},
		{ title: 'event 2', start: '2022-07-29T12:30:00', end: '2022-07-29T15:30:00'},
		{ title: 'event 2', start: '2022-07-29T12:30:00', end: '2022-07-29T15:30:00'},
		{ title: 'event 2', start: '2022-07-29T12:30:00', end: '2022-07-29T15:30:00'},
		{ title: 'event 2', start: '2022-07-29T12:30:00', end: '2022-07-29T15:30:00'},
		{ title: 'event 2', start: '2022-07-29T12:30:00', end: '2022-07-29T15:30:00'},
		{ title: 'event 2', start: '2022-07-29T12:30:00', end: '2022-07-29T15:30:00'}
	])
	let [select, setSelect] = useState(null)

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

	function handleSelect(reservation) {
		console.log(reservation);
		if (reservation !== select) {
			setSelect(reservation)
		} else {
			setSelect({})
		}
	}

	function renderEventContent(eventInfo) {
		return (
			<>
				<b>{eventInfo.timeText}</b>
				<i>{eventInfo.event.title}</i>
			</>
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
						<tbody>{reservation.map((reservation, index) => {
							return (
								<tr key={index}>
									<td><div onClick={() => handleSelect(reservation)}
										className={reservation === select ? "reservation-select" : "reservation-div"}>
										<p>{new Date(reservation.start).toLocaleDateString("en-GB", dateOption)}</p>
										<p>{new Date(reservation.start).toLocaleTimeString([], timeOption) + " - " +
											new Date(reservation.end).toLocaleTimeString([], timeOption)}</p>
									</div></td>
								</tr>
							);
						})}</tbody>
					</table>
				</div>
				<PopUp msg={{title: "Cancel Reservation", detail: select}}/>
			</div>
			<FullCalendar
				plugins={[ dayGridPlugin, InteractionPlugin ]}
				initialView="dayGridMonth"
				events={reservation}
				headerToolbar={{
					start: "prev",
					center: "title",
					right: "next",
				}}
				// height="900px"
				contentHeight="auto"
				aspectRatio={1.2}
				eventColor="#6DCBCA"
				eventDisplay="block"
				displayEventEnd
				businessHours={{
					daysOfWeek: [ 1, 2, 3, 4, 5], // Monday - Friday
					startTime: '10:00',
					endTime: '18:00',
				}}
				eventTimeFormat={{
					hour: 'numeric',
					minute: '2-digit',
					meridiem: false
				}}
				dayMaxEventRows={5}
				validRange={{
					start: new Date().toISOString().substr(0, 8) + "01",
					end: addDays(new Date(), 42).toISOString().substr(0, 10)
				}}
				// eventContent={renderEventContent}
			/>
		</div>
	);
}

export default Home;