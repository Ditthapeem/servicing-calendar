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
  let customer = sessionStorage.getItem('customer')

  function confirm() {
    if (window.confirm(msg.title + "\n" + date + "\n" + startTime + " - " + endTime) === true) {
      if (msg.type === "cancel") {
        handleCancelReserve()
      } else if (msg.type === "booking") {
        handleBooking()
      } else if (msg.type === "close") {
        handleClose()
      } else if (msg.type === "confirm") {
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
        if(!response.data) {
          window.alert("Fail to cancel the reservation with in one day.\nPlease contact admin if you want to cancel reservation.")
        } else {
          return window.location.reload()
        }
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
    }
    if(msg.detail.note) {
      data.note = msg.detail.note
    } else {
      data.note = ""
    }
    if(customer) {
      data.customer = customer
    }
    await axios.post(configData.API.BOOKING, data, {
			headers:{'Authorization':'Token '+ user.token}
			})
      .then(response => {
        setPopUp(false)
        if(user.user.is_staff) {
          return window.location.replace("/reservation")
        } else {
          return window.location.replace("/home")
        }
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
      msg.type === "cancel" && window.alert(`Please select your reservation.`)
      msg.type === "booking" && window.alert(`Please choose your booking time.`)
      msg.type === "close" && window.alert(`Please select closing date.`)
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
            {customer&& <p>Customer: {customer}</p>}
            {msg.type === "close" ? 
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