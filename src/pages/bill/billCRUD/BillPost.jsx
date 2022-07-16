import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addCustomer, fetchpppoePackage } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function CustomerModal() {
  const { t } = useTranslation();
  const auth = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser
  );
  const area = useSelector((state) => state?.persistedReducer?.area?.area);
  const Getmikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );
  const ppPackage = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoePackage
  );
  const [isLoading, setIsloading] = useState(false);
  const [subArea, setSubArea] = useState("");
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const dispatch = useDispatch();

  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("writeMobileNumber")),
    address: Yup.string().required(t("enterName")),
    email: Yup.string()
      .email(t("incorrectEmail"))
      .required(t("enterManagerEmail")),
    nid: Yup.string().required(t("enterNID")),
    monthlyFee: Yup.string().required(t("enterMonthlyFee")),
    Pname: Yup.string().required(t("PPPoEName")),
    Ppassword: Yup.string().required("PPPoE Password"),
    Pprofile: Yup.string().required("PPPoE Profile"),
    Pcomment: Yup.string().required("Comment"),
  });

  // // fetch Area fro select option
  // useEffect(() => {
  //   if (auth.ispOwner) {
  //     dispatch(fetchArea(auth.ispOwner.id));
  //     dispatch(fetchMikrotik(auth.ispOwner.id));
  //   }
  // }, [dispatch, auth.ispOwner]);

  // select subArea
  const selectSubArea = (data) => {
    const areaId = data.target.value;
    if (area) {
      const temp = area.find((val) => {
        return val.id === areaId;
      });
      setSubArea(temp);
    }
  };

  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && auth.ispOwner) {
      const IDs = {
        ispOwner: auth.ispOwner.id,
        mikrotikId: id,
      };
      fetchpppoePackage(dispatch, IDs);
    }
    setSingleMikrotik(id);
  };

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
  };

  // sendint data to backed
  const customerHandler = async (data) => {
    setIsloading(true);
    const subArea = document.getElementById("subAreaId").value;
    if (subArea === "") {
      setIsloading(false);
      return alert(t("selectSubArea"));
    }
    const { ispOwner } = auth;
    const { Pname, Ppassword, Pprofile, Pcomment, ...rest } = data;
    const mainData = {
      customerId: "randon123",
      paymentStatus: "unpaid",
      subArea: subArea,
      ispOwner: ispOwner.id,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      pppoe: {
        name: Pname,
        password: Ppassword,
        profile: Pprofile,
        service: "pppoe",
        comment: Pcomment,
      },
      ...rest,
    };
    // console.log("Main Data: ", mainData);
    addCustomer(dispatch, mainData, setIsloading);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewCustomer")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* model body here */}
              <Formik
                initialValues={{
                  // customerid: "random123",
                  name: "",
                  mobile: "",
                  address: "",
                  email: "",
                  nid: "",
                  monthlyFee: "",
                  Pname: "",
                  Ppassword: "",
                  Pprofile: "",
                  Pcomment: "",
                  // ispOwner:
                }}
                validationSchema={customerValidator}
                onSubmit={(values) => {
                  customerHandler(values);
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="customerGrid">
                      <div className="sectionOne">
                        <FtextField type="text" label={t("name")} name="name" />
                        <FtextField
                          type="text"
                          label={t("mobile")}
                          name="mobile"
                        />
                        <FtextField
                          type="text"
                          label={t("address")}
                          name="address"
                        />
                        <FtextField
                          type="text"
                          label={t("email")}
                          name="email"
                        />
                        <FtextField type="text" label={t("NIDno")} name="nid" />
                        {/* <div className="form-check customerFormCheck">
                          <p>স্টেটাস</p>
                          <div className="form-check form-check-inline">
                            <FtextField
                              label="Paid"
                              className="form-check-input"
                              type="radio"
                              name="status"
                              id="status1"
                              value="paid"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <FtextField
                              label="Unpaid"
                              className="form-check-input"
                              type="radio"
                              name="status"
                              id="status2"
                              value="unpaid"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <FtextField
                              label="Overdue"
                              className="form-check-input"
                              type="radio"
                              name="status"
                              id="status3"
                              value="overdue"
                            />
                          </div>
                        </div> */}

                        {/* <div className="form-check customerFormCheck">
                          <p>বিল পরিশোধের ধরণ </p>
                          <div className="form-check form-check-inline">
                            <FtextField
                              label="Prepaid"
                              className="form-check-input"
                              type="radio"
                              name="billPayType"
                              id="billPayType1"
                              value="prepaid"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <FtextField
                              label="Postpaid"
                              className="form-check-input"
                              type="radio"
                              name="billPayType"
                              id="billPayType2"
                              value="postpaid"
                            />
                          </div>
                        </div> */}
                      </div>
                      {/* section two */}
                      <div className="Section2">
                        {/* <FtextField
                          type="text"
                          label="ব্যালান্স"
                          name="balance"
                        /> */}
                        <FtextField
                          type="text"
                          label={t("monthFee")}
                          name="monthlyFee"
                        />
                        <p className="comstomerFieldsTitle">
                          {t("selectArea")}
                        </p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={selectSubArea}
                        >
                          <option value="">...</option>
                          {area.length === undefined
                            ? ""
                            : area.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                        </select>

                        <p className="comstomerFieldsTitle mt-3">
                          {subArea ? subArea.name + " এর - " : ""}{" "}
                          {t("selectSubArea")}
                        </p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          name="subArea"
                          id="subAreaId"
                        >
                          <option value="">...</option>
                          {subArea?.subAreas
                            ? subArea.subAreas.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))
                            : ""}
                        </select>

                        <p className="comstomerFieldsTitle mt-3">
                          {t("selectMikrotik")}
                        </p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={selectMikrotik}
                        >
                          <option value="">...</option>
                          {Getmikrotik.length === undefined
                            ? ""
                            : Getmikrotik.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                        </select>

                        {/* pppoe package */}
                        <p className="comstomerFieldsTitle mt-3">
                          {t("selectPPPoEPackage")}
                        </p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={selectMikrotikPackage}
                        >
                          <option value="">...</option>
                          {ppPackage.length === undefined
                            ? ""
                            : ppPackage.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>
                      <div className="section3">
                        <FtextField
                          type="text"
                          label={t("PPPoEName")}
                          name="Pname"
                        />
                        <FtextField
                          type="text"
                          label={t("password")}
                          name="Ppassword"
                        />
                        <FtextField
                          type="text"
                          label={t("profile")}
                          name="Pprofile"
                        />
                        <FtextField
                          type="text"
                          label={t("comment")}
                          name="Pcomment"
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {t("cancle")}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : t("save")}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
