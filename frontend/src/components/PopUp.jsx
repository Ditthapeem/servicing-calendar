import React, { useState } from 'react';

import configData from "../config";
import '../assets/PopUp.css';

const PopUp = ({ msg }) => {
  const dateOption = configData.DATE_OPTION;
	const timeOption = configData.TIME_OPTION;
  const [popUp, setPopUp] = useState(false);

  function cancelReserve() {
    if (window.confirm("cancel", msg.detail) === true) {
      console.log("done");
    } else {
      setPopUp(false)
    }
  }

  function handleCheck() {
    console.log(msg.detail);
    if (msg.title === "Cancel Reservation") {
      msg.detail === null ? window.alert(`Please select your reservation.`) : setPopUp(true)
    } else if (msg.title === "Confirm Booking") {
      msg.detail === null ? window.alert(`Please choose your booking time.`) : setPopUp(true)
    } else if (msg.title === "Close Store") {
      msg.detail === null ? window.alert(`Please select closing date.`) : setPopUp(true)
    }
  }

  return (
    <div>
      <button className='popup-button' onClick={e => {handleCheck()}}>{msg.title}</button>
      {popUp &&
        <div className='popup'>
          <div className='popup-div'>
            <h2>{msg.title}</h2>
            <p>{new Date(msg.detail.start).toLocaleDateString("en-GB", dateOption)}<br/>
              {new Date(msg.detail.start).toLocaleTimeString([], timeOption) + " - " +
                new Date(msg.detail.end).toLocaleTimeString([], timeOption)}</p>
            <div style={{justifyContent: "space-around", display: "flex"}}>
              <button onClick={e => cancelReserve()}>Yes</button>
              <button onClick={e => {setPopUp(false)}} style={{background:"gray"}}>No</button>
            </div>
          </div>
        </div>}
    </div>
  );
}
export default PopUp;