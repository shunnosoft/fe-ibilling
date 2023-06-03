import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import { useSelector } from "react-redux";
import { resellerRecharge } from "../../features/getIspOwnerUsersApi";
import apiLink from "../../api/apiLink";

const ResellerOnlinePayment = ({ show, setShow }) => {
  const { t } = useTranslation();

  // reseller data
  const resellerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );
  // reseller data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData
  );

  // payment amount state
  const [paymentAmount, setPaymentAmount] = useState("");

  // customer agreement state
  const [agreement, setAgreement] = useState(false);

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  // user data state
  const [userData, setUserData] = useState(null);

  // user data setState
  useEffect(() => {
    if (resellerData) {
      setUserData(resellerData);
    }
  }, [resellerData]);

  // modal close handler
  const handleClose = () => setShow(false);

  // deposit payment handler
  const resellerPaymentHandler = async () => {
    const data = {
      amount: paymentAmount,
      merchantInvoiceNumber: Date.now(),
      intent: "sale",
      reseller: userData.id,
      ispOwner: userData.ispOwner,
    };

    resellerRecharge(data, setIsLoading);
  };

  const bKash = window.bkash;

  let URL = {
    create: "reseller/bkash-create-recharge",
    execute: "reseller/bkash-execute-recharge",
    baseURL: apiLink,
  };

  useEffect(() => {
    let paymentID = "";
    if (userData) {
      bKash.init({
        paymentMode: "checkout", //fixed value ‘checkout’
        paymentRequest: {
          amount: paymentAmount,
          merchantInvoiceNumber: Date.now(),
          intent: "sale",
          ispOwner: userData.ispOwner,
          reseller: userData.id,
        },
        createRequest: async function (request) {
          try {
            const { data } = await URL.baseURL.post(URL.create, request);
            if (data?.statusCode === "0000") {
              localStorage.setItem("paymentAmount", paymentAmount);
              sessionStorage.setItem("qrispid", userData.ispOwner);
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
        executeRequestOnAuthorization: async function () {
          const resellerRechargeData = {
            amount: paymentAmount,
            reseller: userData.id,
            ispOwner: userData.ispOwner,
          };
          try {
            const { data } = await URL.baseURL.post(
              `${URL.execute}?paymentID=${paymentID}reseller=${userData.id}`,
              resellerRechargeData
            );
            if (data.resellerRecharge.paymentStatus === "paid") {
              window.location.href = "/payment/success";
            } else {
              window.location.href = "/payment/failed";
              bKash.execute().onError();
            }
          } catch (error) {
            bKash.execute().onError();
            window.location.href = "/payment/failed";
            console.log(error);
          }
        },
      });
    }
  }, [userData, paymentAmount]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <ModalHeader closeButton>
        <ModalTitle>
          <h5 className="modal-title text-black">{t("paymentAmount")}</h5>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div>
          <input
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="form-control "
            type="number"
            placeholder={t("enterYourAmount")}
          />
        </div>

        <div class="form-check mt-4">
          <input
            onChange={(e) => setAgreement(e.target.checked)}
            className="form-check-input "
            type="checkbox"
            id="agreement"
          />
          <label htmlFor="agreement">
            {t("doYouAgreeOurTermsAndConditions")}
          </label>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClose}
        >
          {t("cancel")}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          id={"bKash_button"}
          disabled={!agreement}
        >
          {isLoading ? <Loader /> : t("pay")}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ResellerOnlinePayment;
