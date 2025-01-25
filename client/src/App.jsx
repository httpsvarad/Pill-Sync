import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import Home from '../pages/Home'
import Medicines from '../pages/Medicines'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/med" element={<Medicines />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
      </Routes>
    </div>
  )
}

export default App