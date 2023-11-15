import React, { useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import { ShieldExclamation } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

//internal import
import useISPowner from "../../hooks/useISPOwner";
import { deleteACustomer } from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import Loader from "../../components/common/Loader";
import { deleteHotspotCustomer } from "../../features/hotspotApi";

const ProfileDelete = ({
  modalShow,
  setModalShow,
  customerId,
  setShow,
  status,
  page,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // ispOwner user data
  const ispOwner = useISPowner();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // mikrotik chack state
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  // modal close handle
  const handleClose = () => setModalShow(false);

  // profile permanently delete handle
  const profileDeleteHandler = () => {
    // send data for api
    const data = {
      ispID: ispOwner?.ispOwnerId,
      customerID: customerId,
      mikrotik: mikrotikCheck,
    };

    // const resellerCusData = {
    //   reseller: singleData.reseller,
    //   customerID: customerId,
    //   mikrotik: mikrotikCheck,
    // };

    // api call
    if (status !== "reseller") {
      if (page === "hotspot") {
        deleteHotspotCustomer(dispatch, data, setIsLoading, setModalShow);
      } else {
        deleteACustomer(dispatch, data, setIsLoading, "", setModalShow);
      }
    } else {
      // deleteResellerCustomer(dispatch, resellerCusData, setIsLoading);
    }
  };
  return (
    <>
      <Modal
        show={modalShow}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="md"
        centered
      >
        <ModalBody>
          <div className="defaultProfile">
            <ShieldExclamation className="text-warning" size={100} />
            <h2 className="my-3">{t("areYouSure")}</h2>

            <div className="profileAgree">
              <p>{t("permanentlyDelete")}</p>

              {ispOwner?.hasMikrotik && (
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="deleteAgree"
                    checked={mikrotikCheck}
                    onChange={(event) => setMikrotikCheck(event.target.checked)}
                  />
                  <label
                    className="fw-500"
                    style={{ color: "#bbbbbb" }}
                    htmlFor="deleteAgree"
                  >
                    {t("deleteMikrotik")}
                  </label>
                </div>
              )}
            </div>

            <div className="displayGrid1">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShow(true);
                  setModalShow(false);
                }}
                disabled={isLoading}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="btn"
                onClick={profileDeleteHandler}
                style={{ background: "#f77220" }}
              >
                {isLoading ? <Loader /> : t("delete")}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProfileDelete;
