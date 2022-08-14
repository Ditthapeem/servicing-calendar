import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

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
		textAlign: "center",
		position: "absolute",
		top: "40%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		fontSize: "20px"
	}
	return (
		<div style={style}>
			<h1>404 page not found</h1>
			<p>get lost? <Link to={path}>Home</Link></p>
		</div>
	);
}

export default Error404;