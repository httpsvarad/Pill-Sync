import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import Home from '../pages/Home'
import Medicines from '../pages/Medicines'
import MedicinePage from '../pages/MedicinePage'
// import EditMedicine from '../pages/EditMedicine'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/med" element={<Medicines />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/medicine" element={<MedicinePage />} />
      
      </Routes>
    </div>
  )
}

export default App