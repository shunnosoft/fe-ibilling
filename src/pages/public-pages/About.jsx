import React from "react";
import { NavLink } from "react-router-dom";
import FooterLink from "./FooterLink";
// import { useSelector } from "react-redux";
import "./netfee.css";

export default function About() {
  // const currentUser = useSelector(state => state.auth.currentUser);

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
            <p style={{ height: "50px" }}></p>
            <p className="intro1 mt-5">
              শূন্য আইটি (Shunno Software) প্রধানত একটি সফ্টওয়্যার ডেভেলপমেন্ট
              কোম্পানি যেটি উৎসাহী প্রকৌশলী এবং ব্যবসা পরিচালকদের একটি ছোট গ্রুপ
              থেকে বেড়ে উঠেছে। এখন আমরা বিভিন্ন পরিষেবা সহ একটি পূর্ণ-স্কেল
              সফ্টওয়্যার ডেভেলপমেন্ট সংস্থা। আমরা কিছু উদ্ভাবনী সফ্টওয়্যার
              পরিষেবা বিকাশ করছি এবং আমাদের পণ্যগুলির সাথে আমাদের সম্প্রদায়কে
              যুক্ত করার জন্য নিবেদিত৷
              <br /> <br />
              শূন্য আইটি (Shunno Software) ২০১৭ সালে আমাদের ক্লায়েন্টের
              প্রয়োজনীয়তা পূরণের জন্য কাস্টমাইজড সফ্টওয়্যার, অ্যাপ্লিকেশন এবং
              ব্যবহার করার জন্য প্রস্তুত সফ্টওয়্যার বিকাশ এবং সরবরাহ করার জন্য
              প্রতিষ্ঠিত হয়েছিল। আমাদের ডেভেলপমেন্ট টিম পরিপূর্ণতা সহ এবং সঠিক
              সময়ে কাস্টমাইজড সফ্টওয়্যার সরবরাহ করে আমাদের ক্লায়েন্টদের
              সন্তুষ্টি প্রদান করে। আমরা সাশ্রয়ী হারে সব ধরনের অ্যাপ্লিকেশন
              সফ্টওয়্যার বিকাশ করি যাতে আমাদের ক্লায়েন্টরা সহজেই এই
              সফ্টওয়্যারটি ব্যবহার করতে পারে। আমরা আমাদের ক্লায়েন্টের স্বপ্নকে
              বাস্তবে রূপান্তরের দিকে মনোনিবেশ করি। আমাদের পেশাদার দলে রয়েছে
              অভিজ্ঞ সফ্টওয়্যার ডেভেলপার, ডিজাইনার, মার্কেটিং এক্সিকিউটিভ যারা
              আপনাকে আপনার ব্যবসার প্রয়োজনীয়তা অনুযায়ী সেরা সফ্টওয়্যার
              প্রদানে সাহায্য করবে। আমরা যে সমস্ত সফ্টওয়্যার তৈরি করি তার জন্য
              আমরা প্রদর্শনী প্রদান করি। এটি একটি উদ্ভাবনী, বিশ্বস্ত এবং সক্ষম
              সফ্টওয়্যার কোম্পানি যার একটি একক দৃষ্টিভঙ্গি রয়েছে - তথ্য
              প্রযুক্তির শক্তিকে কাজে লাগানো।
              <br /> <br />
              আমাদের ট্রেড লাইসেন্স নম্বর: 06/B - 0135
            </p>

            <p className="intro1 mt-5">
              Shunno Software is mainly a software development company that has
              grown from a small group of passionate engineers and business
              managers. Now we are a full-scale software development company
              including various services. We are developing some innovative
              software services and are dedicated to serving our community with
              our products. <br /> <br />
              Shunno Software was founded in 2017 to develop and provide
              customized software, applications and ready to use software in
              order to fulfill our client's requirements. Our development team
              delivers customized software with perfection and in accurate time,
              thus provides satisfaction to our clients. We develop all types of
              application software at a cost-effective rate so that our clients
              can easily avail this software. We focus on converting our
              client's dream into reality. Our professional team includes
              experienced software developers, designers, marketing executives
              who will help you in providing the best software as per your
              business requirements. We provide demonstrations for all the
              software we develop. It is an innovative, trusted and competent
              software company with a single-minded vision -Empowering
              Enterprises to Leverage the Power of Information Technology.
              <br /> <br />
              Our Trade Licsence Number is: 06/B - 0135
            </p>
            <br />

            <FooterLink />
          </div>
        </div>
      </div>
    </div>
  );
}
