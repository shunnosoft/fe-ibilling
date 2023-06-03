import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { FtextField } from "../../../components/common/FtextField";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import Loader from "../../../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import { postIspOwnerSupporterNumber } from "../../../features/apiCalls";

const SupportNumberPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  // start & end date state
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // supports validation
  const customerValidator = Yup.object({
    name: Yup.string().min(3).required(t("writeSupportName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
  });

  // modal close handler
  const handleClose = () => setShow(false);

  // support number submit handler
  const supportNumbersHandler = (values) => {
    const { name, ...res } = values;

    // mobile number validation
    if (values.mobile === "") {
      setIsLoading(false);
      return toast.error(t("writeMobileNumber"));
    }

    if (startTime === "") {
      setIsLoading(false);
      return toast.error(t("selectStartTime"));
    }

    if (endTime === "") {
      setIsLoading(false);
      return toast.error(t("selectEndTime"));
    }

    let currStartTime = "";
    if (startTime) {
      var [hours, minutes, meridian] = startTime.split(":");

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
    if (startTime) {
      var [hours, minutes, meridian] = endTime.split(":");

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
      name: name,
      start: currStartTime,
      end: currEndTime,
      ispOwner: ispOwner,
      ...res,
    };

    postIspOwnerSupporterNumber(dispatch, sendingData, setIsLoading, setShow);
    setStartTime("");
    setEndTime("");
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <ModalHeader closeButton>
        <ModalTitle>
          <h5 className="text-success fw-bold lh-sm">
            {t("createCustomersSupporter")}
          </h5>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            name: "",
            mobile: "",
          }}
          validationSchema={customerValidator}
          onSubmit={(values) => {
            supportNumbersHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="support">
              <FtextField
                type="text"
                label={t("name")}
                name="name"
                validation={"true"}
              />

              <FtextField
                type="text"
                label={t("mobile")}
                name="mobile"
                validation={"true"}
              />

              <div className="billCycle">
                <label className="form-control-label changeLabelFontColor">
                  {t("selectStartTime")}
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  type="time"
                  className="form-control mw-100"
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="billCycle mt-3">
                <label className="form-control-label changeLabelFontColor">
                  {t("selectEndTime")}
                  <span className="text-danger ms-1">*</span>
                </label>
                <input
                  type="time"
                  className="form-control mw-100"
                  onChange={(e) => setEndTime(e.target.value)}
                />
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
  );
};

export default SupportNumberPost;
