import React, { useState, useEffect } from "react";
import axios from 'axios'
import configData from "../config";

import Navbar from '../components/Navbar';

import '../assets/About.css';

const About = () => {
	let user = JSON.parse(sessionStorage.getItem('user'))
	const timeOption = configData.TIME_OPTION;
	let [store, setStore] = useState({
		info: "",
		address: "",
		address_url: "",
		open: "",
		close: "",
		email: "",
		phone: ""
	})
	// let [faq, setFAQ] = useState([	{question: "Location", answer: "Av. du Théatre 7 1005 Lausanne"},
	// 								{question: "Telephone", answer: "076 393 28 87‬"},
	// 								{question: "Email", answer: "lepage.chindarat@gmail.com"},
	// 							])
	
	useEffect(() => {
		async function getStore() {
			await axios.get(configData.API.STORE, {
				headers:{'Authorization':'Token '+ user.token}
				})
				.then(response => {
					setStore(response.data[0])
				})
				.catch(error => {
					window.alert(error)
				})
		}

		getStore()
  }, [user.token]);


	return (
		<div>
			<Navbar user={user}/>
			<div className="about">
				<h1>About Us</h1>
				<div style={{justifyContent: "space-around", display: "flex"}}>
					<div className="about-location">
						<h3>Store Location</h3>
						<div><iframe 
							title="googleMap"
							src= {store.address_url}
							style={{borderRadius:"8px"}}
							width="100%"
							height="450px"
							frameBorder="0">
						</iframe></div>
					</div>
					<div className="about-info">
						<h3>Relax, Refresh, Recharge… </h3>
						<div>
							<p>{store.info}</p>
						</div>
					</div>
					<div className="about-contact">
						<h3>Contact</h3>
							<table>
								<tbody>
									<tr><td>address:</td><td>{store.address}</td></tr>
									<tr><td>open:</td><td>{new Date("2022-01-01 " + store.open).toLocaleTimeString([], timeOption)}</td></tr>	
									<tr><td>close:</td><td>{new Date("2022-01-01 " + store.close).toLocaleTimeString([], timeOption)}</td></tr>
									<tr><td>email:</td><td>{store.email}</td></tr>	
									<tr><td>phone:</td><td>{store.phone}</td></tr>	
								{/* <p style={{fontWeight: "bold"}}>{faq[0].question}</p>
								<p style={{fontSize: "14px"}}>{faq[0].answer}</p> */}
								</tbody>
							</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;