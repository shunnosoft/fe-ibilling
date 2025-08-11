import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FtextField } from "../../../components/common/FtextField";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";
import { updateIspOwnerSupporterNumber } from "../../../features/apiCalls";

const SupportNumberEdit = ({ supportId, editShow, setEditShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // oneBilling support data
  const ispOwnerSupportNumbers = useSelector(
    (state) => state.netFeeSupport?.ispOwnerSupport
  );

  //get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  // start & end date state
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  // single support number find
  const singleSupport = ispOwnerSupportNumbers.find(
    (val) => val.id === supportId
  );

  // single support data update
  useEffect(() => {
    setStartTime(singleSupport?.start);
    setEndTime(singleSupport?.end);
  }, [singleSupport]);

  // supports validation
  const customerValidator = Yup.object({
    name: Yup.string().min(3).required(t("writeSupportName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
  });

  // modal close handler
  const handleClose = () => setEditShow(false);

  // start time handler
  const startTimeHandler = (value) => {
    let currStartTime = "";
    if (startTime) {
      var [hours, minutes, meridian] = value.split(":");

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
    setStartTime(currStartTime);
  };

  // end time handler
  const endTimeHandler = (value) => {
    let currEndTime = "";
    if (startTime) {
      var [hours, minutes, meridian] = value.split(":");

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
    setEndTime(currEndTime);
  };

  // support update submit handler
  const supportNumbersUpdateHandler = (values) => {
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

    const sendingData = {
      name: name,
      start: startTime,
      end: endTime,
      ispOwner: ispOwner,
      ...res,
    };
    updateIspOwnerSupporterNumber(
      dispatch,
      sendingData,
      ispOwner,
      supportId,
      setIsLoading,
      setEditShow
    );
  };

  return (
    <Modal
      show={editShow}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
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
            name: singleSupport?.name,
            mobile: singleSupport?.mobile,
          }}
          validationSchema={customerValidator}
          onSubmit={(values) => {
            supportNumbersUpdateHandler(values);
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
                  onChange={(e) => startTimeHandler(e.target.value)}
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
                  onChange={(e) => endTimeHandler(e.target.value)}
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

export default SupportNumberEdit;
