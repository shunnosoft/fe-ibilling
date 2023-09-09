import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../../components/common/Loader";
import {
  patchBulletin,
  patchBulletinPermission,
  postBulletin,
} from "../../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DatePickerField from "../../../../components/common/DatePickerField";
import moment from "moment";
import { getBulletinPermission } from "../../../../features/apiCallAdmin";

const BulletinPost = ({ show, setShow, editId }) => {
  const dispatch = useDispatch();
  const { bulletinId, modalStatus } = editId;

  // bulletin validation
  const netFeeBulletin = Yup.object({
    title: Yup.string(),
    startDate: Yup.string().required("Select Bulletin Start Date"),
    endDate: Yup.string().required("Select Bulletin End Date"),
    ispOwner: Yup.string(),
    reseller: Yup.string(),
    allPage: Yup.string(),
    customer: Yup.string(),
    activeCustomer: Yup.string(),
    dashboard: Yup.string(),
    deposit: Yup.string(),
    message: Yup.string(),
    collection: Yup.string(),
    othersCustomer: Yup.string(),
  });

  //  netFee Bulletin all data
  const bulletinData = useSelector((state) =>
    modalStatus === "bulletinEdit" ? state.netFeeSupport?.bulletin : ""
  );

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // single bulletin find
  let singleBulletin;
  if (bulletinId) {
    singleBulletin = bulletinData.find((val) => val.id === bulletinId);
  }

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // modal close handle
  const handleClose = () => setShow(false);

  // bulletin submit handler
  const bulletinHandler = (values) => {
    const {
      title,
      startDate,
      endDate,
      ispOwner,
      reseller,
      allPage,
      customer,
      activeCustomer,
      dashboard,
      deposit,
      message,
      collection,
      othersCustomer,
    } = values;
    if (!(values.ispOwner || values.reseller)) {
      toast.error("One status must be selected.");
      return;
    }

    const sendData = {
      title,
      startDate,
      endDate,
      ispOwner,
      reseller,
    };

    const permission = {
      pagePermission: {
        allPage,
        customer,
        activeCustomer,
        dashboard,
        deposit,
        message,
        collection,
        othersCustomer,
      },
    };

    postBulletin(dispatch, sendData, setIsLoading, setShow);
    patchBulletinPermission(dispatch, permission);
  };

  // bulletin update data submit handler
  const bulletinEditHandler = (values) => {
    const {
      title,
      startDate,
      endDate,
      ispOwner,
      reseller,
      allPage,
      customer,
      activeCustomer,
      dashboard,
      deposit,
      message,
      collection,
      othersCustomer,
    } = values;

    if (!(values.ispOwner || values.reseller)) {
      toast.error("One status must be selected.");
      return;
    }

    const sendData = {
      title,
      startDate,
      endDate,
      ispOwner,
      reseller,
    };
    const permission = {
      pagePermission: {
        allPage,
        customer,
        activeCustomer,
        dashboard,
        deposit,
        message,
        collection,
        othersCustomer,
      },
    };

    patchBulletin(dispatch, bulletinId, sendData, setIsLoading, setShow);
    patchBulletinPermission(dispatch, permission);
  };

  useEffect(() => {
    // bulletin api
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, [modalStatus === "bulletinEdit"]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="text-secondary modal-title">Create new Bulletin</h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              title: singleBulletin ? singleBulletin?.title : "",
              startDate: singleBulletin
                ? moment(singleBulletin?.startDate).format(
                    "MMM DD yyyy hh:mm A"
                  )
                : "",
              endDate: singleBulletin
                ? moment(singleBulletin?.endDate).format("MMM DD yyyy hh:mm A")
                : "",
              ispOwner: singleBulletin ? singleBulletin?.ispOwner : false,
              reseller: singleBulletin ? singleBulletin?.reseller : false,
              allPage: butPermission ? butPermission?.allPage : false,
              customer: butPermission ? butPermission?.customer : false,
              activeCustomer: butPermission
                ? butPermission?.activeCustomer
                : false,
              dashboard: butPermission ? butPermission?.dashboard : false,
              deposit: butPermission ? butPermission?.deposit : false,
              message: butPermission ? butPermission?.message : false,
              collection: butPermission ? butPermission?.collection : false,
              othersCustomer: butPermission
                ? butPermission?.othersCustomer
                : false,
            }}
            validationSchema={netFeeBulletin}
            onSubmit={(values) => {
              modalStatus === "bulletinEdit"
                ? bulletinEditHandler(values)
                : bulletinHandler(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form>
                <Field
                  className="form-control"
                  as="textarea"
                  name="title"
                  placeholder="Title..."
                  rows="6"
                />

                <div className="displayGrid2">
                  <DatePickerField
                    className="form-control"
                    name="startDate"
                    showTimeSelect
                    dateFormat="MMM dd yyyy hh:mm aa"
                    placeholderText="Start Date"
                  />

                  <DatePickerField
                    className="form-control"
                    name="endDate"
                    showTimeSelect
                    dateFormat="MMM dd yyyy hh:mm aa"
                    placeholderText="End Date"
                  />
                </div>

                <div className="d-flex justify-content-between">
                  {/* panel selection */}
                  <div>
                    <label className="form-check-label text-secondary">
                      Select the Panel
                    </label>
                    <div className="form-check me-4">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="ispOwnerShow"
                        name="ispOwner"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="ispOwnerShow"
                      >
                        IspOwner
                      </label>
                    </div>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="resellerShow"
                        name="reseller"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="resellerShow"
                      >
                        Reseller
                      </label>
                    </div>
                  </div>

                  {/* panel page selection */}
                  <div>
                    <label className="form-check-label text-secondary">
                      Select the Panel page
                    </label>
                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="allPage"
                        name="allPage"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="allPage"
                      >
                        All Page
                      </label>
                    </div>

                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="dashboard"
                        name="dashboard"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="dashboard"
                      >
                        Dashboard
                      </label>
                    </div>

                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="customer"
                        name="customer"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="customer"
                      >
                        Customer
                      </label>
                    </div>

                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="activeCustomer"
                        name="activeCustomer"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="activeCustomer"
                      >
                        Active Customer
                      </label>
                    </div>

                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="othersCustomer"
                        name="othersCustomer"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="othersCustomer"
                      >
                        Other Customer
                      </label>
                    </div>

                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="collection"
                        name="collection"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="collection"
                      >
                        Collection Report
                      </label>
                    </div>

                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="deposit"
                        name="deposit"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="deposit"
                      >
                        Deposit
                      </label>
                    </div>

                    <div className="form-check">
                      <Field
                        className="form-check-input"
                        type="checkbox"
                        id="message"
                        name="message"
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="message"
                      >
                        Message
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary ms-3"
                    onClick={() => setShow(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-sm btn-outline-success"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader /> : "Submit"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default BulletinPost;
