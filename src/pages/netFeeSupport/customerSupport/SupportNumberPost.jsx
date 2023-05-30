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
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  // supports validation
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeSupportName")),
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

    // time validation
    const current = new Date();
    const time = current.toLocaleTimeString("en-bn", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (moment(startTime).format("hh:mm A") === time) {
      setIsLoading(false);
      return toast.error(t("selectStartTime"));
    }

    if (moment(endTime).format("hh:mm A") === time) {
      setIsLoading(false);
      return toast.error(t("selectEndTime"));
    }

    const sendingData = {
      name: name,
      start: moment(startTime).format("hh:mm a"),
      end: moment(endTime).format("hh:mm a"),
      ispOwner: ispOwner,
      ...res,
    };

    postIspOwnerSupporterNumber(dispatch, sendingData, setIsLoading);
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
                min={3}
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

                <DatePicker
                  className="form-control mw-100"
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  dateFormat="hh:mm a"
                  showTimeSelect
                  placeholderText={t("startTime")}
                />
              </div>

              <div className="billCycle mt-3">
                <label className="form-control-label changeLabelFontColor">
                  {t("selectEndTime")}
                  <span className="text-danger ms-1">*</span>
                </label>

                <DatePicker
                  className="form-control mw-100"
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  dateFormat="hh:mm a"
                  showTimeSelect
                  placeholderText={t("endTime")}
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
