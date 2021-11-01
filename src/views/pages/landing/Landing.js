import React from 'react'
import './landing.css'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="logiginWrapper">
      <div className="container">
        <div className="navivationBar">
          <div className="row">
            <div className="col-2">
              <h2>Logo </h2>
            </div>
            <div className="col-10 gotoLogin">
              <Link to="login" className="custom-btn">
                লগইন
              </Link>
            </div>
          </div>
        </div>
        <div className="landingMain">
          <h2 className="landingTitle">শূন্য সফটওয়্যার </h2>
          <span className="landingText">
            আমরা বাংলায় ওয়েব ডেডলপমেন্ট নিয়ে কাজ করতে গিয়ে প্রথম যে সমস্যাটার মুখোমুখি হই, সেটা হলো,
            বাংলা ডেমো টেক্সট। ইংরেজির জন্য lorem ipsum তো আছে । বাংলার জন্য কি আছে? সেই ধারনা থেকেই
            বাংলা ডেমো টেক্সট তৈরীর চেষ্টা।
          </span>
          <br />
          <Link to="/register" className="landingSubscribeBtn custom-btn">
            সাবস্ক্রাইব
          </Link>
        </div>
        <div className="landingFooter">
          <span>@copyright 2021 sunnosoft</span>
        </div>
      </div>
    </div>
  )
}
export default Landing
