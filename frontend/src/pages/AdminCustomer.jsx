import React, { useState, useEffect } from "react";

import AdminNavbar from '../components/AdminNavbar';

const AdminCustomer = () => {
	let user = JSON.parse(sessionStorage.getItem('user'))

	return (
		<div>
			<AdminNavbar user={user}/>
		</div>
	);
}

export default AdminCustomer;