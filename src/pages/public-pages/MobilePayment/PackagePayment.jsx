import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { publicRequest } from "../../../api/apiLink";

const PackagePayment = ({ customer, ispInfo }) => {
  const packags = useSelector((state) => state.publicSlice?.publicPackage);

  const [hotspotPackage, setHotspotPackage] = useState({});

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
          amount: 1, //paymentAmount
          merchantInvoiceNumber: Date.now(),
          intent: "sale",
          ispOwnerId: ispInfo.id,
          name: customer.name,
          mobile: customer.mobile,
          billType: "bill",
          hotspotPackage: hotspotPackage.id,

          // customer: userData.id,
          // user: userData.id,
          // userType: userData.userType,
          // medium: userData.ispOwner.bpSettings?.paymentGateway?.gatewayType,
          // month: selectedMonth?.map((item) => item.value).join(","),
          paymentStatus: "pending",
          collectedBy: "customer",
        },
        createRequest: async function (request) {
          try {
            console.log({ request });
            const { data } = await URL.baseURL.post(URL.create, request);
            if (data?.statusCode === "0000") {
              localStorage.setItem("paymentAmount", 1);
              localStorage.setItem("username", customer.name);
              localStorage.setItem("password", "NF123456");

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
      <Card.Body className="displayGrid packagePage">
        {packags?.map((pack, index) => (
          <div
            key={index}
            className={`package-card d-flex gap-3 align-items-center p-3 mb-3 rounded shadow-sm ${
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
              <p className="mb-0 text-muted">{pack?.rate} tk</p>
            </div>
          </div>
        ))}
      </Card.Body>

      <button
        id={gatewayType === "bKashPG" ? "bKash_button" : ""}
        onClick={gatewayType !== "bKashPG" ? "" : () => {}}
        type="button"
        className="btn btn-sm btn-success shadow-none mt-3"
      >
        {"Pay"}
      </button>
    </>
  );
};

export default PackagePayment;
