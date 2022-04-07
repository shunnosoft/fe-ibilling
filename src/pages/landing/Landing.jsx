import React from "react";
import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
import "./landing.css";

export default function Landing() {
  // const currentUser = useSelector((state) => state.auth.currentUser);

  // console.log("From Landing: ", currentUser);

  // const currentUser = false;
  return (
    <div className="mainlanding">
      <div className="landingWrapper">
        <div className="container-fluide">
          {/* <video src="img/v3.mp4" muted loop autoplay type="mp4"></video> */}
          <div className="textBox">
            <div className="landingMain">
              <img className="landingLogo" src="./assets/img/logo.png" alt="" />
              <p className="landingText"></p>

              <NavLink to="/register">
                <p className="goToLoginPage custom-btn"> সাইন আপ</p>
              </NavLink>
              {/* <h2 className="LandingTitle">নেটফি</h2> */}
            </div>
          </div>
          <div className="textBox2">
            <p className="intro1">
              বর্তমান বিশ্বে যোগাযোগ ব্যবস্থার উন্নতি ও অগ্রগতিতে অন্যতম অবদান
              হিসেবে ইন্টারনেট এর ভূমিকা অপরিসীম। সঠিক চ্যানেল ও ডিস্ট্রিবিউশন
              এর মাধ্যমে ঘরে ঘরে ইন্টারনেট পৌঁছে দিতে সার্ভিস প্রোভাইডারদের
              বিভিন্ন সমস্যা সমাধানের লক্ষ্যে শূণ্য আইটি নিয়ে এসেছে বাংলা ও সহজে
              ব্যবহারযোগ্য বিলিং সফটওয়্যার নেটফি। সম্পূর্ন অনলাইন এই
              সফটওয়্যারটি, সার্ভিস এবং গ্রাহক সংখ্যার উপর ভিত্তি করে বিভিন্ন
              প্যকেজ আকারে প্রোভাইডারদের হাতে পৌঁছে দেওয়া হয়। আমাদের দক্ষ
              ইঞ্জিনিয়ার, টিম ও সাপোর্ট মেম্বারগণ সর্বদা গ্রাহক সেবায় নিয়োজিত
              আছেন।
            </p>
            <h3>নেটফি সফটওয়্যার এ রয়েছে উপযোগী কিছু আকর্ষণীয় ফিচার।</h3>
            <ul className="bulletul">
              <li className="bullet">রিসেলার প্যানেল।</li>
              <li className="bullet"> মাল্টিপল মাইক্রোটিক কনফিগারেশন।</li>
              <li className="bullet"> ডেট টু ডেট বিলিং সাইকেল।</li>
              <li className="bullet">
                ইউজার প্যানেল৷ এলার্ট ও বিল কনফার্মেশন এসএমএস।
              </li>
              <li className="bullet">কাস্টমার পেমেন্ট গেটওয়ে ইন্ট্রিগ্রেশন।</li>
            </ul>
            <h3>নেটফি এর সুবিধাসমূহঃ</h3>
            <ul className="bulletul2">
              <li>কাস্টমার এপ। </li>
              <li>রিসেলার প্যানেল। </li>
              <li> লাইনম্যান প্যানেল। </li>
              <li> বিল কালেক্টর প্যানেল।</li>
              <li>গ্রাহক অটো অন/অফ।</li>
              <li>বিল কনফার্মেশন মেসেজ। </li>
              <li>বিলিং সাইকেল (ডেট টু ডেট বিল) </li>
              <li>একাধিক মাইক্রোটিক কনফিগারেশন। </li>
              <li>অটোমেটিক এলার্ট মেসেজ (বিলিং সাইকেলের ২ দিন আগে)</li>
              <li>লাইনম্যান প্যানেল (এপ থেকে নতুন আইডি তৈরি করতে পারবে)</li>
              <li>
                রিসেলারের জন্য আলাদা এরিয়া, সাব-এরিয়া, ম্যানেজার, কালেক্টর।
              </li>
              <li>লাইভ সাপোর্ট </li>
              <li>নিয়মিত ফ্রি সফ্টওয়ার আপডেট, কাস্টমাইজ ফিচার। </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
