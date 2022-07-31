import React, { useState } from 'react';

import '../assets/PopUp.css';

const PopUp = ({ msg }) => {
  const dateOption = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
	const timeOption = {hour: '2-digit', minute:'2-digit'}
  const [popUp, setPopUp] = useState(false);

  function cancelReservation() {
    if (window.confirm("cancel", msg.detail) === true) {
      console.log("done");
    } else {
      setPopUp(false)
    }
  }

  function handleCheck() {
    if (msg.title === "Cancel Reservation") {
      msg.detail === null ? window.alert(`Please select your reservation.`) : setPopUp(true)
    } else if (msg.title === "Confirm Booking") {
      msg.detail === null ? window.alert(`Please choose your booking time.`) : setPopUp(true)
    }
  }

  return (
    <div>
      <button className='popup-button' onClick={e => {handleCheck()}}>{msg.title}</button>
      {popUp &&
        <div className='popup'>
          <div className='popup-div'>
            <h2>{msg.title}</h2>
            <p>{new Date(msg.detail.start).toLocaleDateString("en-GB", dateOption)}</p>
            <p>{new Date(msg.detail.start).toLocaleTimeString([], timeOption) + " - " +
              new Date(msg.detail.end).toLocaleTimeString([], timeOption)}</p>
            <div style={{justifyContent: "space-around", display: "flex"}}>
              <button onClick={e => cancelReservation()}>Yes</button>
              <button onClick={e => {setPopUp(false)}} style={{background:"gray"}}>No</button>
            </div>
          </div>
        </div>}
    </div>
  );
}
export default PopUp;