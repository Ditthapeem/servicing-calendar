import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Booking from './pages/Booking'
import About from './pages/About'

import AdminReservation from './pages/AdminReservation'
import AdminCustomer from './pages/AdminCustomer'
import AdminStore from './pages/AdminStore'
import AdminCustomerList from './pages/AdminCustomerList'

import Error404 from './pages/Error404'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/about" element={<About />} />

      <Route path="/reservation" element={<AdminReservation />} />
      <Route path="/customer" element={<AdminCustomer />} />
      <Route path="/store" element={<AdminStore />} />
      <Route path="/customerlist" element={<AdminCustomerList />} />

      <Route path="/404" element={<Error404 />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}

export default App;
