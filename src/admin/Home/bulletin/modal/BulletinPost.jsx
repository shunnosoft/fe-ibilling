import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../../components/common/Loader";
import { postBulletin } from "../../../../features/apiCalls";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { FtextField } from "../../../../components/common/FtextField";
import DatePickerField from "../../../../components/common/DatePickerField";
import moment from "moment";

const BulletinPost = ({ show, setShow }) => {
  const dispatch = useDispatch();

  // bulletin validation
  const netFeeBulletin = Yup.object({
    title: Yup.string(),
    startDate: Yup.string().required("Select Bulletin Start Date"),
    endDate: Yup.string().required("Select Bulletin End Date"),
    ispOwner: Yup.string(),
    reseller: Yup.string(),
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // modal close handle
  const handleClose = () => setShow(false);

  // bulletin submit handler
  const bulletinHandler = (values) => {
    const { title, startDate, endDate, ispOwner, reseller } = values;

    if (!(ispOwner || reseller)) {
      toast.error("One status must be selected.");
      return;
    }

    const sendData = {
      title,
      startDate: moment(startDate).format("YYYY/MM/DD"),
      endDate: moment(endDate).format("YYYY/MM/DD"),
      ispOwner,
      reseller,
    };
    postBulletin(dispatch, sendData, setIsLoading, setShow);
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
              title: "",
              startDate: "",
              endDate: "",
              ispOwner: false,
              reseller: false,
            }}
            validationSchema={netFeeBulletin}
            onSubmit={(values) => {
              bulletinHandler(values);
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
                    placeholderText="Start Date"
                  />

                  <DatePickerField
                    className="form-control"
                    name="endDate"
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
