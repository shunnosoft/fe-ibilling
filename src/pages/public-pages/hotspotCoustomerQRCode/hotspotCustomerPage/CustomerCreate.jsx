import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

//internal import
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";
import { hotspotUserCreate } from "../../../../features/publicHotspotApi/publicHotspot";
import { toast } from "react-toastify";

const CustomerCreate = ({ setModalStatus, ispInfo }) => {
  const dispatch = useDispatch();

  // customer create validator
  const customerValidator = Yup.object({
    dayLength: Yup.number()
      .integer()
      .min(1, "Minimum Day-1")
      .required("Minimum Day-1"),
    monthlyFee: Yup.number()
      .integer()
      .min(0, "Minimum Package Rate 1")
      .required("Enter Package Rate"),
    name: Yup.string().required("Write Customer Name"),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, "Incorrect Mobile Number")
      .min(11, "Write 11 Digit Mobile Number")
      .max(11, "Over 11 Digit Mobile Number")
      .required("Write Mobile Number"),
    hotspotPassword: Yup.string().required("Write PPPoE Password"),
    address: Yup.string(),
  });

  //curent month date
  const today = new Date();
  const monthDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // get customer package form store
  const packags = useSelector((state) => state.publicSlice?.publicPackage);

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  // customer package state
  const [packageInfo, setPackageInfo] = useState();

  // customer package rate
  const [packageRate, setPackageRate] = useState("");

  // package id state
  const [packageId, setPackageId] = useState();

  // customer select date state
  const [dayToday, setDayToday] = useState(monthDay);

  // package select handler
  const selectPackage = (data) => {
    setPackageId(data);
    const filterPackageRate = packags?.find((item) => item.id === data);
    setPackageInfo(filterPackageRate);
  };

  // customer daily package rate handle
  useEffect(() => {
    const dt = new Date();
    const getTotalMonthDate = new Date(
      dt.getFullYear(),
      dt.getMonth() + 1,
      0
    ).getDate();

    if (dayToday === getTotalMonthDate) {
      setPackageRate(packageInfo?.rate);
    } else {
      const cusotmerPerDayBill = packageInfo?.rate / getTotalMonthDate;

      const dayTodayFee = cusotmerPerDayBill * dayToday;
      setPackageRate(Math.trunc(dayTodayFee));
    }
  }, [dayToday, packageInfo]);

  // modal close handler
  const closeHandler = () => setModalStatus("");

  //hotspot user create
  const createUserHandle = (value) => {
    if (!packageId) {
      setIsLoading(false);
      return toast.error("Select Package");
    }

    if (!value?.address) {
      setIsLoading(false);
      return toast.error("Enter your location!");
    }

    const sendingData = {
      dayLength: Number(dayToday),
      monthlyFee: value?.monthlyFee,
      name: value?.name,
      mobile: value?.mobile,
      password: value.hotspotPassword,
      address: value?.address,
      hotspotPackage: packageId,
      billingCycle: new Date(),
    };
    hotspotUserCreate(dispatch, ispInfo?.id, sendingData, setIsLoading);
    setModalStatus("");
  };

  return (
    <>
      <Card.Body>
        <Formik
          initialValues={{
            dayLength: dayToday,
            monthlyFee: packageRate,
            name: "",
            mobile: "",
            hotspotPassword: "",
            address: "",
          }}
          validationSchema={customerValidator}
          onSubmit={(values) => createUserHandle(values)}
          enableReinitialize
        >
          {() => (
            <Form id="customerPost">
              <div className="displayGrid">
                <FtextField
                  type="number"
                  label="Day Length"
                  name="dayLength"
                  validation={"true"}
                  onChange={(e) => setDayToday(e.target.value)}
                />

                <div>
                  <label className="form-control-label changeLabelFontColor">
                    Select Package
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select mw-100 mt-0"
                    onChange={(event) => selectPackage(event.target.value)}
                  >
                    <option value="">...</option>
                    {packags?.map((val, key) => (
                      <option key={key} value={val.id}>
                        {val.name}
                      </option>
                    ))}
                  </select>
                </div>

                <FtextField
                  type="number"
                  label="Package Rate"
                  name="monthlyFee"
                  min={0}
                  validation={"true"}
                />

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
                  type="text"
                  label="Password"
                  name="hotspotPassword"
                  validation={"true"}
                />

                <FtextField type="text" label="Address" name="address" />
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
      <Card.Footer>
        <div className="displayGrid1">
          <button
            type="button"
            className="btn btn-secondary w-100"
            disabled={isLoading}
            onClick={closeHandler}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="customerPost"
            className="btn btn-success w-100"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Submit"}
          </button>
        </div>
      </Card.Footer>
    </>
  );
};

export default CustomerCreate;
