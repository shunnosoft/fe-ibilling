import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ToastContainer,
} from "react-bootstrap";
import Loader from "../../../../components/common/Loader";
import { toast } from "react-toastify";
import { FtextField } from "../../../../components/common/FtextField";
import moment from "moment";
import { postNetFeeSupportNumbers } from "../../../../features/apiCalls";
import { useDispatch } from "react-redux";

const CreateSupportNumber = ({ show, setShow }) => {
  const dispatch = useDispatch();

  // supports validation
  const supportNumbers = Yup.object({
    name: Yup.string().min(3).required("Write Supporter Name"),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, "Incorrect Mobile Number")
      .min(11, "Write 11 Digit Mobile Number")
      .max(11, "Over 11 Digit Mobile Number")
      .required("Write Mobile Number"),
    startTime: Yup.string().required("Select Support Start Time"),
    endTime: Yup.string().required("Select Support End Time"),
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // supporter is show
  const [isShow, setIsShow] = useState(false);

  // modal close handler
  const handleClose = () => setShow(false);

  // support number submit handler
  const supportNumbersHandler = (values) => {
    const { name, mobile } = values;

    let currStartTime = "";
    if (values.startTime) {
      var [hours, minutes, meridian] = values.startTime.split(":");

      if (hours > 12) {
        meridian = "PM";
        hours -= 12;
      } else if (hours < 12) {
        meridian = "AM";
        if (hours == 0) {
          hours = 12;
        }
      } else {
        meridian = "PM";
      }
      currStartTime = hours + ":" + minutes + " " + meridian;
    }

    let currEndTime = "";
    if (values.endTime) {
      var [hours, minutes, meridian] = values.endTime.split(":");

      if (hours > 12) {
        meridian = "PM";
        hours -= 12;
      } else if (hours < 12) {
        meridian = "AM";
        if (hours == 0) {
          hours = 12;
        }
      } else {
        meridian = "PM";
      }
      currEndTime = hours + ":" + minutes + " " + meridian;
    }

    const sendingData = {
      name,
      isShow,
      mobile,
      start: currStartTime,
      end: currEndTime,
    };

    postNetFeeSupportNumbers(dispatch, sendingData, setIsLoading, setShow);
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="text-success fw-bold lh-sm">
              Create Support Number
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              mobile: "",
              startTime: "",
              endTime: "",
            }}
            validationSchema={supportNumbers}
            onSubmit={(values) => {
              supportNumbersHandler(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form id="support">
                <FtextField
                  type="text"
                  label="Name"
                  name="name"
                  validation={"true"}
                />

                <FtextField
                  type="text"
                  label="Mobile"
                  name="mobile"
                  validation={"true"}
                />

                <FtextField
                  type="time"
                  label="Select Support Start Time"
                  name="startTime"
                  validation={"true"}
                />

                <FtextField
                  type="time"
                  label="Select Support End Time"
                  name="endTime"
                  validation={"true"}
                />

                <div className="autoDisable mt-3">
                  <input
                    id="isShow"
                    type="checkBox"
                    checked={isShow}
                    onChange={(e) => setIsShow(e.target.checked)}
                  />
                  <label htmlFor="isShow" className="ms-2">
                    Is Show
                  </label>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={isLoading}
            type="submit"
            className="btn btn-success"
            form="support"
          >
            {isLoading ? <Loader /> : "submit"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CreateSupportNumber;
