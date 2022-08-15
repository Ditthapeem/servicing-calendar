import React, { useState } from "react";

import Navbar from '../components/Navbar';

import '../assets/About.css';

const About = () => {
	let user = JSON.parse(sessionStorage.getItem('user'))

	let [locationURL, setlocationURL] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2745.488809042708!2d6.6379351!3d46.518228400000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c2e34e1b85a65%3A0xaced0c4ecd7edd96!2sAv.%20du%20Th%C3%A9%C3%A2tre%207%2C%201005%20Lausanne%2C%20Switzerland!5e0!3m2!1sen!2sth!4v1660576117357!5m2!1sen!2sth")
	let [faq, setFAQ] = useState([	{question: "Location", answer: "Av. du Théatre 7 1005 Lausanne"},
									{question: "Telephone", answer: "076 393 28 87‬"},
									{question: "Email", answer: "lepage.chindarat@gmail.com"},
								])

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
						<h3>Relax, Refresh, Recharge… </h3>
						<div>
							<p>Anatta vous invite à prendre le temps de vous détendre et de vous rafraîchir les idées.</p>
							<p>Idéalement situé au cœur de Lausanne, vous pourrez y profiter de soins adaptés à vos besoins pour repartir du bon pied!</p></div>
					</div>
					<div className="about-faq">
						<h3>Contact</h3>
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