import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  customerNumber,
  customerNumberDelete,
  customerNumberUpdate,
} from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

const CustomersNumber = ({ showModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get search customer
  const customer = useSelector((state) => state?.customer?.searchCustomer);

  //modal open and hide state
  const [show, setShow] = useState(false);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  //customer data state
  const [data, setData] = useState("");

  // customer search number state
  const [mobile, setMobile] = useState();

  // customer number update or delete state
  const [customerInfo, setCustomerInfo] = useState("");

  // customer number update state
  const [updateCustomerNumber, setUpdateCustomerNUmber] = useState("");

  //modal handler
  const handleClose = () => {
    setShow(false);
    setMobile("");
    setData("");
    setCustomerInfo("");
  };

  //customer number search handler
  const customerNumberSearch = (e) => {
    e.preventDefault();
    customerNumber(dispatch, setIsLoading, ispOwner, mobile);
  };

  // customer mobile number search handler
  const customerNumberHandler = (e) => {
    setMobile(e.target.value);
  };

  // customer mobile update or delete function handler
  const customerUpdateDelete = (e) => {
    if (e.target.value === "edit") {
      setCustomerInfo(e.target.value);
    } else if (e.target.value === "delete") {
      let confirm = window.confirm(t("doYouWantToDeleteMobileNumber"));
      if (confirm) {
        customerNumberDelete(dispatch, setIsDelete, ispOwner, mobile);
      }

      setMobile("");
      setData("");
      setShow(false);
    }
  };

  // customer mobile number update handler
  const customerMobileNumberUpdate = () => {
    if (updateCustomerNumber.length < 11 || updateCustomerNumber.length > 11) {
      toast.error(t("write11DigitMobileNumber"));
    } else {
      customerNumberUpdate(
        dispatch,
        setIsLoading,
        setShow,
        setData,
        ispOwner,
        mobile,
        updateCustomerNumber
      );
    }
  };

  useEffect(() => {
    if (showModal) {
      setShow(showModal);
    }
  }, [showModal]);

  useEffect(() => {
    setData(customer);
  }, [customer]);

  return (
    // customer number update or delete modal
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 class="modal-title" id="exampleModalLabel">
              {t("updateCustomer")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {
            <div className="form-group mt-3">
              <h6 className="mb-0 text-secondary">
                {t("inputYourCustomerNumber")}
              </h6>
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="text"
                  onChange={customerNumberHandler}
                ></input>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={customerNumberSearch}
                >
                  {t("search")}
                </button>
              </div>
            </div>
          }

          {data?.customerId && (
            <>
              <div className="mt-4">
                <table
                  className="table table-bordered"
                  style={{ lineHeight: "12px" }}
                >
                  <tbody>
                    <tr>
                      <td>{t("id")}</td>
                      <td>
                        <b>{customer?.customerId}</b>
                      </td>
                      <td>{t("pppoe")}</td>
                      <td>
                        <b>{customer?.pppoe?.name}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("name")}</td>
                      <td>
                        <b>{customer?.name}</b>
                      </td>
                      <td>{t("mobile")}</td>
                      <td className="text-primary">
                        <b>{customer?.mobile}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {!customerInfo && (
                <div className="mt-2">
                  <button
                    disabled={isDelete}
                    type="button"
                    class="btn btn-info me-4"
                    value="edit"
                    onClick={customerUpdateDelete}
                  >
                    {t("edit")}
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    value="delete"
                    onClick={customerUpdateDelete}
                  >
                    {isDelete ? <Loader /> : t("delete")}
                  </button>
                </div>
              )}

              {customerInfo && data && (
                <div className="form-group mt-3">
                  <h6 className="mb-0 text-secondary">
                    {t("inputYourCustomerNumber")}
                  </h6>
                  <div className="d-flex">
                    <input
                      className="form-control me-2"
                      type="number"
                      onChange={(e) => setUpdateCustomerNUmber(e.target.value)}
                    ></input>

                    <button
                      type="button"
                      className="btn btn-outline-success float-start"
                      onClick={customerMobileNumberUpdate}
                    >
                      {isLoading ? <Loader /> : t("submit")}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={isLoading}
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            {t("cancel")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CustomersNumber;
