import React, { useState } from 'react';
import axios from 'axios';

import configData from "../config";
import convertMinutes from '../utils/convertMinutes';
import '../assets/PopUp.css';

const PopUp = ({ msg, user }) => {
  const dateOption = configData.DATE_OPTION;
	const timeOption = configData.TIME_OPTION;
  const [popUp, setPopUp] = useState(false);
  let [date, setDate] = useState()
  let [startTime, setStartTime] = useState()
  let [endTime, setEndTime] = useState()

  function confirm() {
    if (window.confirm(msg.title + "\n" + date + "\n" + startTime + " - " + endTime) === true) {
      if (msg.title === "Cancel Reservation") {
        handleCancelReserve()
      } else if (msg.title === "Confirm Booking") {
        handleBooking()
      } else if (msg.title === "Close Store") {
        handleClose()
      } else if (msg.title === "Confirm Reservation") {
        handleConfirmReserve()
      }
    } else {
      setPopUp(false)
    }
  }

  async function handleCancelReserve() {
    let data = {id: String(msg.detail.id)}
    await axios.post(configData.API.DELETE_RESERVE, data, {
			headers:{'Authorization':'Token '+ user.token}
			})
      .then(response => {
        setPopUp(false)
        return window.location.reload()
      })
      .catch(error => {
        window.alert(error)
      })
  }

  async function handleConfirmReserve() {
    let data = {id: String(msg.detail.id)}
    await axios.post(configData.API.CONFIRM_RESERVE, data, {
			headers:{'Authorization':'Token '+ user.token}
			})
      .then(response => {
        setPopUp(false)
        return window.location.reload()
      })
      .catch(error => {
        window.alert(error)
      })
  }

  async function handleBooking() {
    let data = {
      start: msg.detail.start.split(' ').join('T'),
      end: msg.detail.end.split(' ').join('T'),
      duration: convertMinutes(msg.detail.course),
      note: ""
    }
    await axios.post(configData.API.BOOKING, data, {
			headers:{'Authorization':'Token '+ user.token}
			})
      .then(response => {
        setPopUp(false)
        return window.location.replace("/home")
      })
      .catch(error => {
        window.alert(error)
      })
  }

  async function handleClose() {
    let data = {
      close_date: msg.detail.start.toISOString().substr(0, 10)
    }
    await axios.post(configData.API.CLOSE, data, {
			headers:{'Authorization':'Token '+ user.token}
			})
      .then(response => {
        setPopUp(false)
        return window.location.reload()
      })
      .catch(error => {
        window.alert(error)
      })
  }

  function handleCheck() {
    if (msg.detail === null) {
      msg.title === "Cancel Reservation" && window.alert(`Please select your reservation.`)
      msg.title === "Confirm Booking" && window.alert(`Please choose your booking time.`)
      msg.title === "Close Store" && window.alert(`Please select closing date.`)
    } else {
      setDate(new Date(msg.detail.start).toLocaleDateString("en-GB", dateOption))
      setStartTime(new Date(msg.detail.start).toLocaleTimeString([], timeOption))
      setEndTime(new Date(msg.detail.end).toLocaleTimeString([], timeOption))
      setPopUp(true)
    }
  }

  return (
    <div>
      <button className='popup-button' onClick={e => {handleCheck()}}>{msg.title}</button>
      {popUp &&
        <div className='popup'>
          <div className='popup-div'>
            <h2>{msg.title}</h2>
            {msg.title === "Close Store" ? 
            <p>{date}</p> : <p>{date}<br/>{startTime + " - " + endTime}</p> 
            }
            <div style={{justifyContent: "space-around", display: "flex"}}>
              <button onClick={e => confirm()}>Yes</button>
              <button onClick={e => {setPopUp(false)}} style={{background:"gray"}}>No</button>
            </div>
          </div>
        </div>}
    </div>
  );
}
export default PopUp;