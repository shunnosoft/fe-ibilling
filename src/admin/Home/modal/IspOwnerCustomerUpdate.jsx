import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";
import { updateIspOwnerCustomerStatus } from "../../../features/apiCallAdmin";

const IspOwnerCustomerUpdate = ({
  isShow,
  setIsShow,
  ispOwnerId,
  companyName,
}) => {
  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  // customerPayment status filter state
  const [statusFilter, setFilterStatus] = useState("allCustomer");

  // temporary payment status handle state
  const [tempStatus, setTempStatus] = useState("");

  // payment status state
  const [paymentStatus, setPaymentStatus] = useState("");

  // balance zero handle state
  const [balance, setBalance] = useState("");

  //modal show handler
  const handleClose = () => {
    setIsShow(false);
  };

  // payment status update handler
  const statusUpdateHandler = (e) => {
    const { checked } = e.target;
    if (checked) {
      setTempStatus("status");
    } else {
      setTempStatus("");
      setPaymentStatus("");
    }
  };

  // onSubmit ispOwner customer status
  const customerStatusHandler = () => {
    if (paymentStatus === "") {
      setIsLoading(false);
      return toast.error("Please Select Payment Status or Balance");
    }
    const data = {
      ispOwner: ispOwnerId,
      filter: statusFilter,
      paymentStatus: paymentStatus,
      balance: balance,
    };
    updateIspOwnerCustomerStatus(data, setIsLoading, setIsShow);
  };

  return (
    <>
      <Modal
        show={isShow}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="text-success">{companyName}</h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <div
              className="gap-3"
              style={{ display: "flex", justifyContent: "center" }}
            >
              {/* ispOwner customer status filter condition */}
              <div>
                <div className="ownerStatus pb-1 text-danger border-bottom border-danger">
                  <h5 class="text-primary">Filter Customer</h5>
                </div>

                <div>
                  <div className="radioselect">
                    <input
                      id="1"
                      type="radio"
                      className="getValueUsingClass"
                      value="allCustomer"
                      name="filterStatus"
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                      }}
                      checked={statusFilter === "allCustomer"}
                    />
                    <label className="templatelabel" htmlFor="1">
                      All Customer
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="2"
                      type="radio"
                      className="getValueUsingClass"
                      value="paidCustomer"
                      name="filterStatus"
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                      }}
                      checked={statusFilter === "paidCustomer"}
                    />
                    <label className="templatelabel" htmlFor="2">
                      Paid Customer
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="3"
                      type="radio"
                      className="getValueUsingClass"
                      value="unpaidCustomer"
                      name="filterStatus"
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                      }}
                      checked={statusFilter === "unpaidCustomer"}
                    />
                    <label className="templatelabel" htmlFor="3">
                      Un-paid Customer
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="4"
                      type="radio"
                      className="getValueUsingClass"
                      value="paidMinusBalance"
                      name="filterStatus"
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                      }}
                      checked={statusFilter === "paidMinusBalance"}
                    />
                    <label className="templatelabel" htmlFor="4">
                      Paid & Minus Balance
                    </label>
                  </div>
                </div>
              </div>

              {/* vertical rul */}
              <div className="mx-4">
                <div class="vr mt-5" style={{ height: "10rem" }}></div>
              </div>

              {/* ispOwner customer payment status update condition */}
              <div>
                <div className="ownerStatus pb-1 text-danger border-bottom border-danger">
                  <h5 class="text-primary">Update Customer</h5>
                </div>

                <div>
                  {/* status update checkbox */}
                  <div className="radioselect">
                    <input
                      id="status"
                      type="checkbox"
                      className="getValueUsingClass"
                      isChecked
                      onChange={statusUpdateHandler}
                    />
                    {paymentStatus ? (
                      <label className="templatelabel" htmlFor="update">
                        {paymentStatus.toLocaleLowerCase()}
                      </label>
                    ) : (
                      <label className="templatelabel" htmlFor="status">
                        Payment Status
                      </label>
                    )}
                  </div>

                  {/* status selection start */}
                  {tempStatus && (
                    <div className="d-flex me-5">
                      <div className="radioselect">
                        <input
                          id="paid"
                          type="radio"
                          className="getValueUsingClass"
                          name="paymentStatus"
                          value="paid"
                          onChange={(e) => {
                            setPaymentStatus(e.target.value);
                          }}
                          checked={paymentStatus === "paid"}
                        />
                        <label className="templatelabel" htmlFor="paid">
                          Paid
                        </label>
                      </div>
                      <div className="radioselect">
                        <input
                          id="unpaid"
                          type="radio"
                          className="getValueUsingClass"
                          value="unpaid"
                          name="paymentStatus"
                          onChange={(e) => {
                            setPaymentStatus(e.target.value);
                          }}
                          checked={paymentStatus === "unpaid"}
                        />
                        <label className="templatelabel" htmlFor="unpaid">
                          Unpaid
                        </label>
                      </div>
                    </div>
                  )}
                  <div className="radioselect">
                    <input
                      id="balanceZero"
                      type="checkbox"
                      className="getValueUsingClass"
                      name="balance"
                      isChecked
                      onChange={(e) => setBalance(e.target.checked)}
                    />
                    <label className="templatelabel" htmlFor="balanceZero">
                      Balance = 0
                    </label>
                  </div>
                  {/* status selection end */}
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-success"
            disabled={isLoading}
            onClick={customerStatusHandler}
          >
            {isLoading ? <Loader /> : "Submit"}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default IspOwnerCustomerUpdate;
