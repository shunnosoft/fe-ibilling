import React from "react";
import { NavLink } from "react-router-dom";
import FooterLink from "./FooterLink";
import "./netfee.css";

export default function Landing() {
 
  return (
    <div className="mainlanding">
      <div className="landingWrapper">
        <div className="container-fluide landingContainer">
          {/* <video src="img/v3.mp4" muted loop autoplay type="mp4"></video> */}
          <div className="textBox">
            <div className="landingMain">
              <div className="landinglogodiv">
                <img
                  className="landingLogonew"
                  src="./assets/img/logo.png"
                  alt=""
                />
              </div>

              <div className="buttons">
                <NavLink to="/login">
                  <p className="goToLoginPage custom-btn">লগইন</p>
                </NavLink>
                <NavLink to="/register">
                  <p className="goToLoginPage custom-btn"> সাইন আপ</p>
                </NavLink>
              </div>
              {/* <h2 className="LandingTitle">নেটফি</h2> */}
            </div>
          </div>
          <div className="textBox2">
            <p className="intro1">
              বর্তমান বিশ্বে যোগাযোগ ব্যবস্থার উন্নতি ও অগ্রগতিতে অন্যতম অবদান
              হিসেবে ইন্টারনেট এর ভূমিকা অপরিসীম। সঠিক চ্যানেল ও ডিস্ট্রিবিউশন
              এর মাধ্যমে ঘরে ঘরে ইন্টারনেট পৌঁছে দিতে সার্ভিস প্রোভাইডারদের
              বিভিন্ন সমস্যা সমাধানের লক্ষ্যে <i>শূন্য আইটি</i> নিয়ে এসেছে সহজে
              ব্যবহারযোগ্য এবং মাতৃভাষা বাংলায় দেশের প্রথম আইএসপি বিলিং
              সফটওয়্যার{" "}
              <strong>
                <i>নেটফি </i>
              </strong>
              । <br /> <br />
              সম্পূর্ন অনলাইন এই সফটওয়্যারটি, সার্ভিস এবং গ্রাহক সংখ্যার উপর
              ভিত্তি করে বিভিন্ন প্যকেজ আকারে ইন্টারনেট প্রোভাইডারদের হাতে পৌঁছে
              দেওয়া হয়। আমাদের দক্ষ ডেভেলপার ও সাপোর্ট টিম সর্বদা সর্বোচ্চ
              গ্রাহক সেবায় নিয়োজিত আছেন।
            </p>
            <br />
            <h3>নেটফি সফটওয়্যার এ রয়েছে উপযোগী কিছু আকর্ষণীয় ফিচার।</h3>
            <ul className="bulletul">
              <li className="bullet">রিসেলার প্যানেল</li>
              <li className="bullet">কাস্টমার প্যানেল</li>
              <li className="bullet"> একাধিক মাইক্রোটিক কনফিগারেশন</li>
              <li className="bullet"> ডেট টু ডেট বিলিং সাইকেল</li>
              <li className="bullet">এলার্ট ও বিল কনফার্মেশন এসএমএস</li>
              <li className="bullet">কাস্টমার পেমেন্ট গেটওয়ে ইন্ট্রিগ্রেশন</li>
            </ul>
            <br />
            <h3>নেটফি এর সুবিধাসমূহঃ</h3>
            <ul className="bulletul2 mb-5">
              <li>
                নেটফিতে আপনি পাবেন এডমিন, ম্যানেজার, রিসেলার, কালেক্টর,
                লাইনম্যান এবং কাস্টমার প্যনেল।
              </li>
              <li>
                এডমিন এবং ম্যানেজার ওয়েবসাইটের মাধ্যমে নেটফি সফটওয়্যার ব্যবহার
                করতে পারবে।
              </li>
              <li>
                রিসেলার, কালেক্টর এবং লাইনম্যান ওয়েবসাইট এবং মোবাইল এপের মাধ্যমে
                নেটফি সফটওয়্যার ব্যবহার করতে পারবে।
              </li>
              <li>
                আপনার গ্রাহকগণ মোবাইল এপের মধ্যমে তাদের সকল তথ্য দেখতে পারবেন
                এবং পেমেন্ট গেটওয়ের মাধ্যমে মাসিক বিল পরিশোধ করতে পারবে।
              </li>
              <li>
                লাইনম্যান মোবাইল এপের মাধ্যমে নতুন সংযোগ/আইডি তৈরি করতে পারবে।
                নতুন সংযোগ দেয়ার সময় আইডি তৈরির ঝামেলা পোহাতে হবেনা।{" "}
              </li>
              <li>
                বিল কালেক্টর ওয়েব অথবা মোবাইল এপের মাধ্যমে গ্রাহকের বিল আদায়
                করতে পারবে।
              </li>
              <li>
                গ্রাহকের বিলিং ডেট অতিক্রম করলে এবং গ্রাহক বিল প্রদান না করলে
                গ্রাহকের সংযোগ অটোমেটিক বন্ধ হয়ে যাবে এবং বিল প্রদানের পর
                গ্রাহকের সংযোগ অটোমেটিক চালু হয়ে যাবে।
              </li>
              <li>বিল প্রদানের পর গ্রাহকের মোবাইলে কনফার্মেশন মেসেজ পাবে।</li>
              <li>বিলিং সাইকেল (ডেট টু ডেট বিল) </li>
              <li>একাধিক মাইক্রোটিক কনফিগারেশনের সুবিধা। </li>
              <li>
                গ্রাহকের মোবাইলে বিল ডেটের ২ দিন আগে অটোমেটিক এলার্ট মেসেজ যাবে।
              </li>
              <li>আমাদের দক্ষ সাপোর্ট টিম সর্বদা আপনার সেবায় নিয়োজিত। </li>
              <li>
                এছাড়াও আপনি পাবেন নিয়মিত ফ্রি সফটওয়ার আপডেট এবং কাস্টমাইজ ফিচার।{" "}
              </li>
            </ul>

             <FooterLink></FooterLink>
          </div>
        </div>
      </div>
    </div>
  );
}
