import React, { useEffect, useState, useLayoutEffect } from 'react';
import axios from 'axios';

import configData from "../config";
import '../assets/UserSearch.css';

const UserSearch = (props) => {
	let user = JSON.parse(sessionStorage.getItem('user'))
  let [inputs, setInputs] = useState({customer: ""});
	let [customerList, setCustomerList] = useState([]); //list of customer object from search
  let [inputHolder, setInputHolder] = useState("Customer Username");

  useLayoutEffect(() => {
    if(sessionStorage.getItem("customer")) {
      setInputHolder(sessionStorage.getItem("customer"))
    }
  }, []);

  useEffect(() => {
		// const timer = setTimeout(() => {
		// 	handleSearch(inputs.customer) 	// call search API on user input after 400 ms
		// }, 400);
		// return () => clearTimeout(timer);

    handleSearch(inputs.customer)
  }, [inputs.customer]);

  const handleChange = (event) => {
  const name = event.target.name;
	const value = event.target.value.replace(/[^a-zA-Z0-9 ]/ig, '')

  setInputs(values => ({...values, [name]: value}))
  }

	function handleSubmit(event) {
		event.preventDefault();
		handleSearch(inputs.customer)
	}
	
  async function handleSearch(customer) {
		if (customer !== "" && customer !== "/" && customer !== undefined) {
      await axios.get(configData.API.SEARCH_CUSTOMER + customer.replace("/", ""), {
        headers:{'Authorization':'Token '+ user.token}
        })
        .then(response => {
          setCustomerList(response.data)
        })
        .catch(error => {
          window.alert(error)
        })
      } else {
        setCustomerList([]) //clear search result
      }
    }

	function handleSelect(customer) {
		props.sendData(customer);
		setCustomerList([])
		setInputs('')
    setInputHolder(customer.username)
	}

  return (
    <div>
			{/* user input form */}
			<form onSubmit={handleSubmit}>
        <div className="search-input">
          <input
            type="search"
            name="customer"
            placeholder={inputHolder}
            value={inputs.customer || ""} 
            onChange={handleChange}
            />
          {/* <button type="submit">Search</button> */}
        </div>
			</form>
			{/* list of customer from search result */}
			<div className='search-dropdown'>
				{customerList.length > 0 &&
					<table>
						<tbody>{customerList.map((customer, index) => {
              return (
                // add account when user click
                <tr key={index} onClick={() => handleSelect(customer)}>
                  <td>
                    <div>
                      {customer.username}<br/>
                      <small>{customer.name} {customer.surname}</small>
                    </div>
                  </td>
                </tr>	
              );
            })}</tbody>
					</table>}
			</div>
    </div>
  );
}
export default UserSearch;