import React, { useState, useEffect } from "react";
import axios from "axios";
import configData from "../config";

import AdminNavbar from '../components/AdminNavbar';

import '../assets/CustomerList.css';

const AdminCustomerList = () => {
    let user = JSON.parse(sessionStorage.getItem('user'))
    let [customerList, setCustomerList] = useState(null)
    let [selectCustomer, setSelectCustomer] = useState(null)

    useEffect(() => {
		async function getCustomerList() {
			await axios.get(configData.API.CUSTOMER_LIST, {
				headers:{'Authorization':'Token '+ user.token}
				})
				.then(response => {
					setCustomerList(response.data)
				})
				.catch(error => {
					window.alert(error)
				})
		}

		getCustomerList()
    }, [user.token]);

    function handleCustomer() {
        if (selectCustomer) {
            sessionStorage.setItem('customer', selectCustomer)
            window.location.assign("/customer")
        } else {
            window.alert("Select Customer")
        }
    }

    function handleSelectCustomer(customer) {
		if (customer !== selectCustomer) {
			setSelectCustomer(customer)
		} else {
			setSelectCustomer(null)
		}
	}

    return (
        <div style={{textAlign: "center"}}>
			<AdminNavbar user={user}/>
            <div className="customer-table">
                <h1>Customer List</h1>
                {customerList&&<table>
                    <thead>
                        <tr>
                            <td>Username</td>
                            <td>Name</td>
                            <td>Surname</td>
                            <td>Email</td>    
                            <td>Phone</td>
                        </tr>
                    </thead>
						<tbody>{customerList.map((customer, index) => {
                            console.log(customer[0]=== selectCustomer);
							return (
								<tr key={index} style={{background: customer[0]=== selectCustomer && configData.COLOR.YELLOW}} 
                                    onClick={() => handleSelectCustomer(customer[0])}>
									<td>{customer[0]}</td>
                                    <td>{customer[1][0].name}</td>
                                    <td>{customer[1][0].surname}</td>
                                    <td>{customer[1][0].email}</td>
                                    <td>{customer[1][0].phone}</td>
								</tr>
							);
						})}</tbody>
					</table>}
                    <div className="customer-button">
                        <button onClick={()=>{handleCustomer()}} >Customer</button>
                    </div>
            </div>
        </div>
    )
}

export default AdminCustomerList;