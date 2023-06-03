import React, { useState } from "react";
import { Form, Formik } from "formik";
import { FtextField } from "../../../components/common/FtextField";
import DatePicker from "react-datepicker";

const SupportNumberEdit = () => {
  // netFee support data
  const ispOwnerSupportNumbers = useSelector(
    (state) => state.netFeeSupport?.ispOwnerSupport
  );

  // start & end date state
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

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

                <DatePicker
                  className="form-control mw-100"
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  dateFormat="dd/MM/yyyy:hh:mm a"
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
                  dateFormat="dd/MM/yyyy:hh:mm a"
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

export default SupportNumberEdit;
