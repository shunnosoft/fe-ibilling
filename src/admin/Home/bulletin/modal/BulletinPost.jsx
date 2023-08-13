import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../../components/common/Loader";
import { patchBulletin, postBulletin } from "../../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DatePickerField from "../../../../components/common/DatePickerField";
import moment from "moment";

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
  });

  //  netFee Bulletin all data
  const bulletinData = useSelector((state) =>
    modalStatus === "bulletinEdit" ? state.netFeeSupport?.bulletin : ""
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
    if (!(values.ispOwner || values.reseller)) {
      toast.error("One status must be selected.");
      return;
    }

    const sendData = {
      ...values,
    };
    postBulletin(dispatch, sendData, setIsLoading, setShow);
  };

  // bulletin update data submit handler
  const bulletinEditHandler = (values) => {
    if (!(values.ispOwner || values.reseller)) {
      toast.error("One status must be selected.");
      return;
    }

    const sendData = {
      ...values,
    };
    patchBulletin(dispatch, bulletinId, sendData, setIsLoading, setShow);
  };

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

                <div className="d-flex justify-content-center">
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
