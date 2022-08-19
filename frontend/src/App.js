import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Home from './pages/Home'
import Booking from './pages/Booking'
import About from './pages/About'

import AdminSignup from './pages/AdminSignup'
import AdminReservation from './pages/AdminReservation'
import AdminCustomer from './pages/AdminCustomer'
import AdminStore from './pages/AdminStore'

import Error404 from './pages/Error404'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/about" element={<About />} />
      
      <Route path="/signup" element={<AdminSignup />} />
      <Route path="/reservation" element={<AdminReservation />} />
      <Route path="/customer" element={<AdminCustomer />} />
      <Route path="/store" element={<AdminStore />} />

      <Route path="/404" element={<Error404 />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}

export default App;
