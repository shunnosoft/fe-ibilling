export default function FooterLink() {
  return (
    <div className="text-center">
      <a className="footerLink" href="/netfee">
        Home
      </a>{" "}
      |{" "}
      <a className="footerLink" href="/about">
        About Us
      </a>{" "}
      |{" "}
      <a className="footerLink" href="/privacy-policy">
        Privacy Policy
      </a>{" "}
      |{" "}
      <a className="footerLink" href="/terms-conditions">
        Terms & Conditions
      </a>{" "}
      |{" "}
      <a className="footerLink" href="/return-and-refund-policy">
        Return & Refund Policy
      </a>
      <br />
      <img src="./assets/img/ssl.png" height="120px" width="600px"></img>
    </div>
  );
}
