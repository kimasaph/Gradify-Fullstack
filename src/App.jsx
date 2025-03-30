import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/AuthenticationPages/LoginPage'
import SignupPage from '@/pages/AuthenticationPages/SignupPage'
import ForgotPassword from '@/pages/AuthenticationPages/ForgotPassword'
import VerifyCode from '@/pages/AuthenticationPages/VerificationCodePage'
import PasswordReset from './pages/AuthenticationPages/PasswordReset'
function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<PasswordReset />} />
    </Routes>
  )
}

export default App
