import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import configData from "../config";

const Error404 = () => {
	let user = JSON.parse(sessionStorage.getItem('user'))
	let [path, setPath] = useState("")

	useEffect(() => {
		if (!user) {
      setPath("/")
    } else if (user.user.is_staff) {
			setPath("/reservation")
		} else {
			setPath("/home")
		}
  }, [user]);

	const style = {
		backgroundColor: configData.COLOR.BLACK,
		color: "white",
		fontSize: "30px",
		position: "fixed",
		textAlign: "center",
		paddingTop: "10%",
		top: "0",
		bottom: "0",
		left: "0",
		right: "0"
	}
	return (
		<div style={style}>
			<h1>404 page not found</h1>
			<p>get lost? <Link to={path} style={{textDecoration: 'none', color: configData.COLOR.YELLOW}}>Home</Link></p>
		</div>
	);
}

export default Error404;