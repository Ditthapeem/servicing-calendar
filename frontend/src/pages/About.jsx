import React, { useState, useEffect } from "react";
import axios from 'axios';
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
	
	useEffect(() => {
		async function getStore() {
			await axios.get(configData.API.STORE, {
				headers:{'Authorization':'Token '+ user.token}
				})
				.then(response => {
					if(response.data) {
						setStore(response.data)
					} 	
				})
				.catch(error => {
					window.alert(error)
				})
		}

		getStore()
  }, []);


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
								</tbody>
							</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;