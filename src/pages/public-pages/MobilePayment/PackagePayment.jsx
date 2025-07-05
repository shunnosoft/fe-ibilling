import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { publicRequest } from "../../../api/apiLink";

const PackagePayment = ({ customer, ispInfo }) => {
  const packags = useSelector((state) => state.publicSlice?.publicPackage);

  const [hotspotPackage, setHotspotPackage] = useState({});

  function generateNumericPassword(length = 6) {
    const digits = "0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += digits[Math.floor(Math.random() * digits.length)];
    }
    return password;
  }
  const userPassword = generateNumericPassword();

  const bKash = window.bkash;

  let URL = {
    create: "hotspot/bkash/payment-create",
    execute: "hotspot/bkash/payment-execute",
    baseURL: publicRequest,
  };

  useEffect(() => {
    let paymentID = "";

    if (customer) {
      bKash.init({
        paymentMode: "checkout", //fixed value ‘checkout’
        paymentRequest: {
          amount: 1,
          merchantInvoiceNumber: Date.now(),
          intent: "sale",
          ispOwnerId: ispInfo.id,
          name: customer.name,
          mobile: customer.mobile,
          password: userPassword,
          billType: "bill",
          hotspotPackage: hotspotPackage.id,
          ...(customer?.id && { customer: customer.id }),
        },
        createRequest: async function (request) {
          try {
            console.log({ request });
            const { data } = await URL.baseURL.post(URL.create, request);
            if (data?.statusCode === "0000") {
              localStorage.setItem("paymentAmount", 1);
              localStorage.setItem("username", customer.name);
              localStorage.setItem("password", userPassword);

              sessionStorage.setItem("qrispid", ispInfo.id);
              window.location.href = data?.bkashURL;
            }

            if (data?.paymentID) {
              paymentID = data.paymentID;
              bKash.create().onSuccess(data);
            } else {
              bKash.create().onError();
              window.location.href = "/payment/failed";
            }
          } catch (error) {
            bKash.create().onError();
            window.location.href = "/payment/failed";
            console.log(error);
          }
        },
        // executeRequestOnAuthorization: async function () {
        //   const billData = {
        //     amount: 1,
        //     name: customer.name,
        //     billType: "bill",
        //     // customer: userData.id,
        //     ispOwner: ispInfo.id,
        //     // user: userData.id,
        //     // userType: userData.userType,
        //     // medium: userData.ispOwner.bpSettings?.paymentGateway?.gatewayType,
        //     // month: selectedMonth?.map((item) => item.value).join(","),
        //     paymentStatus: "pending",
        //     hotspotPackage: hotspotPackage._id,
        //     // collectorId: userData.ispOwner.id,
        //   };
        //   try {
        //     const { data } = await URL.baseURL.post(
        //       `${URL.execute}?paymentID=${paymentID}`,
        //       billData
        //     );

        //     if (data.bill.paymentStatus === "paid") {
        //       window.location.href = "/payment/success";
        //     } else {
        //       window.location.href = "/payment/failed";
        //       bKash.execute().onError();
        //     }
        //   } catch (error) {
        //     bKash.execute().onError();
        //     window.location.href = "/payment/failed";
        //     console.log(error);
        //   }
        // },
      });
    }
  }, [customer, hotspotPackage]);

  const gatewayType = ispInfo?.bpSettings?.paymentGateway?.gatewayType;

  return (
    <>
      <Card.Title className="mt-4">
        <div className="monthlyBill">
          <span className="text-secondary">Packages</span>
        </div>
      </Card.Title>
      <Card.Body className="displayGrid packagePage">
        {packags?.map((pack, index) => (
          <div
            key={index}
            className={`packageCard package-card d-flex gap-3 align-items-center rounded shadow-sm ${
              hotspotPackage?.name === pack.name ? "selected" : ""
            }`}
            onClick={() => setHotspotPackage(pack)}
            style={{ cursor: "pointer" }}
          >
            <input
              type="radio"
              name="package"
              checked={hotspotPackage?.name === pack.name}
              onChange={() => setHotspotPackage(pack)}
              className="form-check-input"
            />
            <div>
              <h6 className="mb-1">{pack?.name}</h6>
              <p className="mb-0 text-muted">
                {pack?.rate} tk/{pack.validity + pack.packageType}
              </p>
            </div>
          </div>
        ))}
      </Card.Body>

      {ispInfo?.bpSettings?.hasPG && (
        <div className="d-flex justify-content-end">
          <button
            id={gatewayType === "bKashPG" ? "bKash_button" : ""}
            onClick={gatewayType !== "bKashPG" ? "" : () => {}}
            type="button"
            className="btn btn-primary"
          >
            Payment
          </button>
        </div>
      )}
    </>
  );
};

export default PackagePayment;
