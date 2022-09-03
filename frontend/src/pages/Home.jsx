import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from '@fullcalendar/interaction';
import configData from "../config";

import addDays from '../utils/addDays';

import Navbar from '../components/Navbar';
import PopUp from '../components/PopUp';

import '../assets/Home.css';

const Home = () => {
	const dateOption = configData.DATE_OPTION;
	const timeOption = configData.TIME_OPTION;

	let user = JSON.parse(sessionStorage.getItem('user'))
	let [reserve, setReserve] = useState([])
	let [selectReserve, setSelectReserve] = useState(null)
	let [selectReserveDate, setSelectReserveDate] = useState([])
	let [closeDate, setCloseDate] = useState(null)

  useEffect(() => {
		async function getUserData() {
			await axios.get(configData.API.USER_DATA, {
				headers:{'Authorization':'Token '+ user.token}
				})
				.then(response => {
					setCloseDate(response.data[1])
					setSelectReserveDate(response.data[0])
					setReserve(setColor(response.data[0]))
				})
				.catch(error => {
					window.alert(error)
				})
		}

		getUserData()
  }, [user.token]);

	function setColor(reserve) {
		let reserveList = []
		for (let i = 0; i < reserve.length; i++) {
			reserveList.push(reserve[i])
			if(reserve[i].confirmation) {
				reserveList[i].color = configData.COLOR.GREEN
			} else {
				reserveList[i].color = configData.COLOR.BLACK
			}
		}
		return reserveList
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
			x.start.substr(0, 10) >= info.startStr &&
			x.start.substr(0, 10) < info.endStr)
		if (tempReserve.length > 0) {
			setSelectReserveDate(tempReserve)
		} else {
			setSelectReserveDate(reserve)
		}
	}

	function handleEventClick(info) {
		let event = reserve.find(x => x.id.toString() === info.event.id)
		let start = event.start.substr(0, 10)
		let end = addDays(new Date(start), 1).toISOString().substr(0, 10)
		handleSelectReserve(event)
		handleDateSelect({startStr: start, endStr: end})
	}
	
	function handleDayCellClassNames(info) {
		if (closeDate.some(x => x.close_date === info.date.toISOString().substr(0, 10))) {
			info.isDisabled = true
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
				<p>Reservations</p>
				<hr />
				<div className="home-sidebar-table">
					<table>
						<tbody>{selectReserveDate.map((reserve, index) => {
							return (
								<tr key={index}>
									<td><div onClick={() => handleSelectReserve(reserve)}
										className={reserve === selectReserve ? "reserve-select" :
											reserve.confirmation?"reserve-confirm-div":"reserve-not-confirm-div"}>
										<div style={{fontSize: "20px", fontWeight: "500"}}>
											{ reserve.confirmation?<small>Reservation Confirmed</small>:
												<small>Waiting For Confirmation</small> }<br/>
											{new Date(reserve.start).toLocaleDateString("en-GB", dateOption)}<br/>
											{new Date(reserve.start).toLocaleTimeString([], timeOption) + " - " +
												new Date(reserve.end).toLocaleTimeString([], timeOption)}<br/>
											Massage Type: {reserve.massage_type}
										</div>
									</div></td>
								</tr>
							);
						})}</tbody>
					</table>
				</div>
				<PopUp msg={{type: "cancel", title: "Cancel Reservation", detail: selectReserve}} user={user}/>
			</div>
			{closeDate && <FullCalendar
				plugins={[ dayGridPlugin, InteractionPlugin ]}
				timeZone="UTC"
				initialView="dayGridMonth"
				events={reserve}
				headerToolbar={{
					start: "prev",
					center: "title",
					right: "next",
				}}
				// eventColor={configData.COLOR.GREEN}
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
				eventClick={handleEventClick}
				validRange={{
					start: new Date().toISOString().substr(0, 8) + "01",
					end: addDays(new Date(), 42).toISOString().substr(0, 10)
				}}
				dayCellClassNames={handleDayCellClassNames}
				selectable
				select={handleDateSelect}
				eventContent={renderEventContent}
			/>}
		</div>
	);
}

export default Home;