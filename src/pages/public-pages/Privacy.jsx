



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
            <p style={{ height: "50px" }}></p>

            <div className="intro1">
              <h2 className="fw-bolder">PRIVACY POLICY</h2>
              <h3>
                The <b>Shunno Software</b> Privacy Policy was updated on March
                24, 2022.
              </h3>
              <hr />
              <p
                className="lead fw-normal text-muted mb-0"
                style={{ textAlign: "justify" }}
              >
                Please read carefully and familiarize yourself with this Privacy
                Policy to use Shunno Software application and contact us at
                info@shunnoit.com if you have any questions.
                <br />
                <br />
                This privacy policy sets out how <b>Shunno Software</b> collects
                usages, discloses, stores and protects any information that you
                gave when you subscribe to use our service(s) and
                application(s). <b>Shunno Software</b> is committed to ensure
                that your private data that we collect and use is protected and
                we do not share any of your information to any other third
                parties. We may ask you to provide certain information depending
                on the contents and services you use so that we can identify you
                and provide you appropriate service.
                <br />
                <br />
                <b>
                  Collection and Use of Personal Information
                  <br />
                </b>
                <br />
                <b>What personal information we collects are listed here:</b>
                <br />
                <br />
                When you register an account to get <b>Shunno Software</b>{" "}
                services, you may have to provide us some of your personal
                information including your name, organization name, address,
                email address, phone number, date of birth, National Identity
                Number, your passport size photograph.
                <br />
                <br />
                We may collect your location information, device identity to
                identify you concisely to provide our services.
                <br />
                <br />
                When you log in to <b>Shunno Software</b>, we provide an
                authentication number along with your user ID and other
                information that is saved to your device to let you use{" "}
                <b>Shunno Software</b> app securely for entire session and
                during log out we erase all data that we provided during login.
                <br />
                <br />
                During your monthly bill payment our payment gateways require
                your debit / credit card information or your mobile banking
                information to successfully complete online bill payment.
                <br />
                <br />
                When you make conversation with our support team generally you
                have to send text but you may share photos taken either from
                your device’s camera or storage to our support team. You may
                also share any kind of document or media files that describe
                your problems with our services. All these document and media
                file sharing depends on your intention, we do not automatically
                collect any document, media or other types of files from your
                device without your intention and consent.
                <br />
                <br />
                <b>How we use your personal information</b>
                <br />
                <br />
                <b>
                  {" "}
                  We may use your personal information for the following
                  purposes with your consent:
                </b>
                <br />
                <br />
                We may use your personal information to verify your identity,
                verify your bill payments and provide your specific services
                that you bought from us.
                <br />
                <br />
                We may use your email, phone, device identity and other
                information to periodically notify you about service updates,
                changes, purchases, billings, dues, payments and your other
                activities through notifications, emails, messages, phone calls
                and other communicative ways that you allowed by subscriptions.
                <br />
                <br />
                <b>Collection and Use of Non-Personal Information</b>
                <br />
                <br />
                We may collect some non-personal information and store it to
                provide you standard quality services. Non- personal information
                that we collect are listed here:
                <br />
                <br />
                We may collect, use and store your text messages, documents,
                media files that you shared with us in different times and
                purposes.
                <br />
                <br />
                We may collect your location information to keep logs of your
                signing activities and secure your signing in by making alerts
                to you.
                <br />
                <br />
                <b> Controlling Your Personal Information</b>
                <br />
                <br />
                You may choose to restrict the collection or use of your
                personal information in the following ways:
                <br />
                <br />
                Whenever you are asked to fill in a form on the application,
                look for the fields properly that you want or do not want the
                information to be used by our services.
                <br />
                <br />
                If you have previously agreed to us using your personal
                information for service purposes, you may change your mind at
                any time by writing to us.
                <br />
                <br />
                Use of Third-Party Library or SDKs
                <br />
                <br />
                We integrated following third-party libraries into{" "}
                <b>Shunno Software</b> application:
                <br />
                <br />
                Charts - for showing various statistics within a chart.
                <br />
                <br />
                <b>Protection of Your Information</b>
                <br />
                <br />
                <b>Shunno Software</b> is committed to ensure the security of
                your data that you provided. In order to prevent unauthorized
                access or disclosure, we store your data in our server which
                complies all standard security parameters.
                <br />
                <br />
                <b> Your Privacy Rights</b>
                <br />
                <br />
                We do not share, sell, disclose, distribute or lease any of your
                personal information to any other third parties unless we have
                your consent and permission or required by law to do so. You may
                request any time to correct, erase or permanently remove all of
                your information that you provided us and if you do so we are
                obliged to process your request. You can take any actions with
                legal law against us if we violate any part of this privacy
                policy.
                <br />
                <br />
                <b>Privacy Queries</b>
                <br />
                <br />
                If you do not understand or agree with the privacy policy, we
                strongly recommend you not to download, install and use{" "}
                <b>Shunno Software</b> application. If you have any suggestions
                or queries about this privacy policy, please contact with us.{" "}
                <b>Shunno Software</b> may change this privacy policy from time
                to time by updating this privacy policy. You should check this
                privacy policy to ensure that you are not with any inconsistency
                with any updates of this privacy policy. This privacy policy is
                effective from March 24, 2022.
              </p>
            </div>

            <br />
            <FooterLink />
          </div>
        </div>
      </div>
    </div>
  );
}
