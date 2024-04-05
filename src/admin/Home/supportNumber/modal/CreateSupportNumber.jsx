import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import Loader from "../../../../components/common/Loader";
import { FtextField } from "../../../../components/common/FtextField";
import { postNetFeeSupportNumbers } from "../../../../features/apiCalls";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";
import moment from "moment";

const CreateSupportNumber = ({ show, setShow }) => {
  const dispatch = useDispatch();

  // supports validation
  const supportNumbers = Yup.object({
    name: Yup.string().min(3).required("Write Supporter Name"),
    mobile1: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, "Incorrect Mobile Number")
      .min(11, "Write 11 Digit Mobile Number")
      .max(11, "Over 11 Digit Mobile Number")
      .required("Write Mobile Number"),
    mobile2: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, "Incorrect Mobile Number")
      .min(11, "Write 11 Digit Mobile Number")
      .max(11, "Over 11 Digit Mobile Number"),
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // supporter is show
  const [isShow, setIsShow] = useState(false);

  //set customer billing date
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  // support number submit handler
  const supportNumbersHandler = (values, resetForm) => {
    const { name, mobile1, mobile2 } = values;

    const sendingData = {
      name,
      isShow,
      mobile1,
      mobile2,
      start: moment(startDate).format("h:mm A"),
      end: moment(endDate).format("h:mm A"),
    };

    postNetFeeSupportNumbers(
      dispatch,
      sendingData,
      setIsLoading,
      setShow,
      resetForm
    );
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={true}
        size="md"
        header={
          <h5 className="text-success fw-bold lh-sm">Create Support Number</h5>
        }
        footer={
          <button
            disabled={isLoading}
            type="submit"
            className="btn btn-success"
            form="support"
          >
            {isLoading ? <Loader /> : "submit"}
          </button>
        }
      >
        <Formik
          initialValues={{
            name: "",
            mobile1: "",
            mobile2: "",
          }}
          validationSchema={supportNumbers}
          onSubmit={(values, { resetForm }) => {
            supportNumbersHandler(values, resetForm);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="support">
              <div className="displayGrid">
                <FtextField
                  type="text"
                  label="Name"
                  name="name"
                  validation={"true"}
                />

                <FtextField
                  type="text"
                  label="Mobile 1"
                  name="mobile1"
                  validation={"true"}
                />

                <FtextField type="text" label="Mobile 2" name="mobile2" />

                <div>
                  <label className="form-control-label changeLabelFontColor">
                    Select Support Start Time
                    <span className="text-danger ms-2">*</span>
                  </label>
                  <DatePicker
                    className="form-control mw-100"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  />
                </div>

                <div>
                  <label className="form-control-label changeLabelFontColor">
                    Select Support End Time
                    <span className="text-danger ms-2">*</span>
                  </label>

                  <DatePicker
                    className="form-control mw-100"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  />
                </div>

                <div className="autoDisable">
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
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default CreateSupportNumber;
