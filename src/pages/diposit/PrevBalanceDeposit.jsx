import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// internal import
import { addDeposit, getMultipleManager } from "../../features/apiCalls";
import Loader from "../../components/common/Loader";

const PrevBalanceDeposit = ({ show, setShow, depositData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user data form redux
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  // get manager from redux
  const manager = useSelector((state) => state?.manager?.multipleManager);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // manager id
  const [managerId, setManagerId] = useState("");

  useEffect(() => {
    manager.length === 0 && getMultipleManager(dispatch, userData);
  }, [depositData]);

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  // add bill deposit
  const collectorDeposit = () => {
    if (!managerId) {
      toast.error(t("selectManager"));
      return;
    } else {
      const sendingData = {
        depositBy: userData?.user.role,
        amount: depositData.balance,
        balance: depositData.billReport,
        user: userData?.user.id,
        ispOwner: userData?.collector.ispOwner,
        manager: managerId,
        month: depositData.month,
        year: depositData.year,
        note: `${depositData.month} ${depositData.year} collection: ${depositData.billReport} deposit: ${depositData.deposit}`,
      };
      addDeposit(dispatch, sendingData, setIsLoading, setShow);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title text-secondary">
              {t("previousBalance")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <div className="row">
              <h5 className="form-control-label changeLabelFontColor">
                {t("selectManager")}
              </h5>
              {manager?.map((val) => {
                return (
                  <div className="radioSelect">
                    <input
                      className="getValueUsingClass"
                      type="radio"
                      value={val.id}
                      id={val.user}
                      onChange={(e) => {
                        setManagerId(e.target.value);
                      }}
                      checked={managerId === val.id}
                    />
                    <label
                      class="form-check-label templateLabel"
                      htmlFor={val.user}
                    >
                      {val.name}
                    </label>
                  </div>
                );
              })}

              <div className="d-flex justify-content-center mt-4">
                <button
                  type="submit"
                  className="btn btn-outline-primary w-140"
                  onClick={collectorDeposit}
                >
                  {isLoading ? <Loader /> : t("submit")}
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PrevBalanceDeposit;
