import React from 'react'
import './success.css'
import { Link } from 'react-router-dom'
import Confetti from 'react-confetti'

export default function Success() {
  return (
    <div className="customcontainer successMessage">
      <Confetti />
      <h2 className="successTitle">আপনার রেজিস্ট্রেশন সফল হয়েছে </h2>
      <p className="successText">
        আপনি যে ফোন নম্বর দিয়ে রেজিস্ট্রেশন করেছে ওই নম্বর এ SMS এর মাধ্যমে পাসওয়ার্ড পাঠানো হয়েছে ।
        আপনার একাউন্ট এ লগইন করতে মোবাইল নম্বর এবং কাঙ্খিত পাসওয়ার্ড দিন
      </p>
      <Link to="/" className="successButton">
        হোম এ যান
      </Link>
    </div>
  )
}
