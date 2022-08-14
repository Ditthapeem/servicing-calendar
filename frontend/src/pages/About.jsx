import React, { useState } from "react";

import Navbar from '../components/Navbar';

import '../assets/About.css';

const About = () => {
	let user = JSON.parse(sessionStorage.getItem('user'))

	let [locationURL, setlocationURL] = useState("https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15495.431439871221!2d100.5696188!3d13.8475694!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4332e8cd6aec8c31!2z4Lih4Lir4Liy4Lin4Li04LiX4Lii4Liy4Lil4Lix4Lii4LmA4LiB4Lip4LiV4Lij4Lio4Liy4Liq4LiV4Lij4LmM!5e0!3m2!1sth!2sth!4v1659252338932!5m2!1sth!2sth")
	let [faq, setFAQ] = useState([{question: "11+12 is", answer: "1112"}, {question: "11+12 is", answer: "1112"}])

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
							src= {locationURL}
							style={{borderRadius:"8px"}}
							width="400"
							height="400"
							frameBorder="0">
						</iframe></div>
					</div>
					<div className="about-info">
						<h3>Info</h3>
						<div>hi</div>
					</div>
					<div className="about-faq">
						<h3>FAQ</h3>
							{faq.map((faq, index) => {
								return (
									<div key={index} >
										<p style={{fontWeight: "bold"}}>{faq.question}</p>
										<p style={{fontSize: "14px"}}>{faq.answer}</p>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;