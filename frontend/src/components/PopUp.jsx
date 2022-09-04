import React, { useState } from 'react';
import axios from 'axios';

import configData from "../config";
import convertMinutes from '../utils/convertMinutes';
import '../assets/PopUp.css';

const PopUp = ({ popup, user }) => {
  const dateOption = configData.DATE_OPTION;
	const timeOption = configData.TIME_OPTION;
  const [popUp, setPopUp] = useState(false);
  let [date, setDate] = useState()
  let [startTime, setStartTime] = useState()
  let [endTime, setEndTime] = useState()
  let customer = sessionStorage.getItem('customer')

  function confirm() {
    if(popup.type === "close") {
      if (window.confirm(popup.title + "\n" + date ) === true) {
        handleClose()
      }
    }
    else if (window.confirm(popup.title + "\n" + popup.detail.massage_type + "\n" + date + "\n" + startTime + " - " + endTime) === true) {
      if (popup.type === "cancel") {
        handleCancelReserve()
      } else if (popup.type === "booking") {
        handleBooking()
      } else if (popup.type === "confirm") {
        handleConfirmReserve()
      }
    } else {
      setPopUp(false)
    }
  }

  async function handleCancelReserve() {
    let data = {id: String(popup.detail.id)}
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
    let data = {id: String(popup.detail.id)}
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
      start: popup.detail.start.split(' ').join('T'),
      end: popup.detail.end.split(' ').join('T'),
      duration: convertMinutes(popup.detail.course),
      massage_type: popup.detail.massage_type
    }
    if(popup.detail.note) {
      data.note = popup.detail.note
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
      close_date: popup.detail.start.toISOString().substr(0, 10)
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
    if (popup.detail === null) {
      if (popup.type === "cancel" || popup.type === "confirm") {
        window.alert(`Please select your reservation.`)
      } else if (popup.type === "booking") {
        window.alert(`Please choose your booking time.`)
      } else if (popup.type === "close") {
        window.alert(`Please select closing date.`)
      }
    } else {
      setDate(new Date(popup.detail.start).toLocaleDateString("en-GB", dateOption))
      setStartTime(new Date(popup.detail.start).toLocaleTimeString([], timeOption))
      setEndTime(new Date(popup.detail.end).toLocaleTimeString([], timeOption))
      setPopUp(true)
    }
  }

  return (
    <div>
      <button className='popup-button' onClick={e => {handleCheck()}}>{popup.title}</button>
      {popUp &&
        <div className='popup'>
          <div className='popup-div'>
            <h2>{popup.title}</h2>
            {popup.type === "close" ? 
              <p>{date}</p> : 
              <>
                {customer && <p>Customer: {popup.type === "booking"? customer:popup.detail.title}</p>}
                <p>{popup.detail.massage_type}<br/>
                  {date}<br/>
                  {startTime + " - " + endTime}
                </p>
              </>
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