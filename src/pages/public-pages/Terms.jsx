import React from "react";
import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
import FooterLink from "./FooterLink";
import "./netfee.css";

export default function Terms() {
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
            <p style={{ height: "50px" }}></p>

            <div class="intro1">
              <div class="about-content">
                {" "}
                <h2>TERMS &amp; CONDITIONS</h2>{" "}
                <h4>Terms and Conditions for the Provision of Services.</h4>{" "}
                <hr />
                <p>
                  <strong>Shunno Software</strong> Software &amp; Website and
                  Mobile Application Development service provider around the
                  world. We have the liability to protect each client and
                  provide them with the best service achievable. The following
                  rule were designed to ensure that our services remain of the
                  utmost excellence. Please read very carefully before ordering
                  and/or using Smart Software services. Once an order is placed
                  with Smart Software, you concur that you are in accord with
                  and bound by the terms and conditions below.
                </p>{" "}
                <br />
                <p>
                  <strong>Bank Payment:</strong> Cheques should be made payable
                  to: <strong>Shunno Software</strong>{" "}
                </p>{" "}
                <p>
                  <strong>Onlime Payment Gateway:</strong> SSL COMMERZ
                  <br />
                  <strong>Mobile Banking:</strong>
                  <br /> bKash Merchant : <strong>01911038787</strong>
                  <br />
                  bKash/ Rocket/ Nagad : <strong>
                    01717541865
                  </strong> (Personal){" "}
                </p>{" "}
                <br />
                <p>
                  The company reserves the right to charge the amount of any
                  value added tax payable whether or not included on the
                  estimate or invoice.
                </p>{" "}
                <p>
                  All Pricing Policy only for Cloud Hosing Server Providing by
                  Shunno Software
                </p>{" "}
                <p>
                  {" "}
                  Any work done by Smart Software Ltd for any client, which
                  includes the scripts, coding or software, unless mutually
                  agreed, will be copyright of Smart Software and should not be
                  commercially reproduce or resold without the information and
                  authorization of Shunno Software.
                </p>{" "}
                <p>
                  {" "}
                  Smart Software cannot be held responsible for copyright
                  violations caused by materials and content submitted by the
                  Client/ Customer.
                </p>{" "}
                <p>
                  Smart Software will not be responsible for costs incurred,
                  recompense or loss of earnings due to the failure to meet
                  arranged deadlines.
                </p>{" "}
                <p>
                  Smart Software will not be liable for the nonexecution of the
                  project for certain reasons not in control of IT Chimes.
                </p>{" "}
                <p>
                  To the fullest extent permitted at law, Shunno Software
                  provides this website and its contents on an as basis and we
                  make no warranties until a client enters into an agreement
                  with us on pay for service basis. Then the agreement of the
                  service will determine the nature of representations and
                  warranty.
                </p>{" "}
                <p>
                  Shunno Software seeks to ensure that all material on this site
                  is accurate and up-to-date. However, Smart Software Limited is
                  not liable for the content of any outside websites which may
                  be linked to from our site.
                </p>{" "}
                <p>
                  The following terms and conditions will apply to general{" "}
                  <strong>Website Development &amp; Software Services</strong>{" "}
                  offered by Shunno Software By ordering services from Shunno
                  Software you are agreeing to the following terms and
                  conditions.{" "}
                </p>{" "}
                <p>
                  We keep back the right to reject to build a web site which we
                  may judge as unfit due to content or else. This includes, but
                  is not restricted by, sites containing adult oriented material
                  such as pornography, sites which promote hatred towards
                  persons belonging to any ethnic group, religion or ientation
                  and sites which infringe copyright.
                </p>{" "}
                <p>
                  In Website &amp; Software all material, both text and images,
                  supplied by the client and used in the construction, will
                  remain the client's property. All such material will be
                  assumed to be the property of the client and free to use
                  without fear of breach of copyright laws.
                </p>{" "}
                <h3>Backups and Data Management </h3>{" "}
                <p>
                  Your Use of This Service is at Your Sole Risk. Our Backup
                  Service Runs Once a Week/Daily, Overwrites Any of Our Previous
                  Backups Made, and Only One Week of Backups are Kept. Each User
                  is Solely Responsible for All Installation, Maintenance,
                  Security and Backup of The Operating System, Software, Files
                  and Data Used in the User's Container, as Well as Any
                  Reinstalls and Changes. This Service Is Provided to You as a
                  Courtesy. Shunno Software is Not Responsible for Files and/or
                  Data Residing on Your Account. You Agree to Take Full
                  Responsibility For Files And Data Transferred and to Maintain
                  all Appropriate Backup of Files and Data Stored on Smart
                  Software Limited Servers. For its Own Operational Efficiencies
                  and Purposes, Shunno Software From Time to Time Backs Up Data
                  on its Servers, But is Under No Obligation or Duty To
                  Subscriber to do so Under These Terms. It is Solely
                  Subscriber's Duty and Responsibility To Backup Subscriber's
                  Files And Data On Shunno Software Servers, and Under No
                  Circumstance Will Shunno Software be Liable To Anyone For
                  Damages Of Any Kind Under Any Legal Theory For Loss Of
                  Subscriber Files or Data on any Shunno Software Server.
                </p>{" "}
                <h3>Investigation of Violations</h3>{" "}
                <p>
                  Shunno Software may investigate any reported or suspected
                  violation of this Agreement, its policies or any complaints
                  and take any action that it deems appropriate and reasonable
                  under the circumstance to protect its systems, facilities,
                  customers and/or third parties. Smart Software Limited will
                  not access or review the contents of any e-mail or similar
                  stored electronic communications except as required or
                  permitted by applicable law or legal process.
                </p>{" "}
                <h3>Actions to Violations</h3>{" "}
                <p>
                  Shunno Software reserves the right and has absolute discretion
                  to restrict or remove from its servers any content that
                  violates this Agreement or related policies or guidelines, or
                  is otherwise objectionable or potentially infringing on any
                  third party's rights or potentially in violation of any laws.
                  If we become aware of any possible violation by you of this
                  Agreement, any related policies or guidelines, third party
                  rights or laws, Shunno Software may immediately take
                  corrective action, including, but not limited to, (a) issuing
                  warnings, (b) suspending or terminating the Service, (c)
                  restricting or prohibiting any and all uses of content hosted
                  on Shunno Software systems, and/or (d) disabling or removing
                  any hypertext links to third party Web sites, any of your
                  content distributed or made available for distribution via the
                  Services, or other content not supplied by Shunno Software
                  which, in Smart Software Limited sole discretion, may violate
                  or infringe any law or third-party rights or which otherwise
                  exposes or potentially exposes Shunno Software to civil or
                  criminal liability or public ridicule. It is Smart Software
                  Limited policy to terminate repeat infringers. Smart Software
                  Limited right to take corrective action, however, does not
                  obligate us to monitor or exert editorial control over the
                  information made available for distribution via the Services.
                  If Shunno Software takes corrective action due to such
                  possible violation, Shunno Software shall not be obligated to
                  refund to you any fees paid in advance of such corrective
                  action.
                </p>{" "}
                <h3>Revelation Rights</h3>{" "}
                <p>
                  To comply with applicable laws and lawful governmental
                  requests, to protect Shunno Software systems and customers, or
                  to ensure the integrity and operation of Smart Software
                  Limited business and systems, Shunno Software may access and
                  disclose any information it considers necessary or
                  appropriate, including, without limitation, user profile
                  information (i.e., name, e-mail address, etc.), IP addressing
                  and traffic information, usage history, and content residing
                  on Shunno Software servers and systems. Smart Software Limited
                  also reserves the right to report any activity that it
                  suspects violates any law or regulation to appropriate law
                  enforcement officials, regulators, or other appropriate third
                  parties.
                </p>{" "}
                <h3>Warranty Disclaimer: Maintenance </h3>{" "}
                <p>
                  You hereby acknowledge and agree that Shunno Software reserves
                  the right to temporarily suspend services for the purposes of
                  maintaining, repairing, or upgrading its systems and network.
                  Shunno Software will use best efforts to notify you of pending
                  maintenance however at no time is under any obligation to
                  inform you of such maintenance.
                </p>{" "}
              </div>
            </div>
            <br />

            <FooterLink />
          </div>
        </div>
      </div>
    </div>
  );
}
