import React, { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { postCustomer } from "../../../features/customerSlice";
import Loader from "../../../components/common/Loader";
import { getMikrotik, fetchMikrotik } from "../../../features/mikrotikSlice";
import { fetchCustomer } from "../../../features/customerSlice";
import { getArea, fetchArea } from "../../../features/areaSlice";

export default function CustomerModal() {
  const auth = useSelector((state) => state.auth);
  const area = useSelector(getArea);
  const Getmikrotik = useSelector(getMikrotik);
  const [isLoading, setIsloading] = useState(false);
  const [subArea, setSubArea] = useState("");
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const dispatch = useDispatch();

  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    address: Yup.string().required("নাম দিন"),
    email: Yup.string()
      .email("ইমেইল সঠিক নয় ")
      .required("ম্যানেজার এর ইমেইল দিতে হবে"),
    nid: Yup.string().required("NID দিন"),
    status: Yup.string().required("Choose one"),
    balance: Yup.string().required("Balance দিন"),
    monthlyFee: Yup.string().required("Montly Fee দিন"),
    Pname: Yup.string().required("PPPoE নাম"),
    Ppassword: Yup.string().required("PPPoE Password"),
    Pprofile: Yup.string().required("PPPoE Profile"),
    Pcomment: Yup.string().required("Comment"),
  });

  // fetch Area fro select option
  useEffect(() => {
    if (auth.ispOwner) {
      dispatch(fetchArea(auth.ispOwner.id));
      dispatch(fetchMikrotik(auth.ispOwner.id));
    }
  }, [dispatch, auth.ispOwner]);

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
    if (Getmikrotik.length !== undefined) {
      const temp = Getmikrotik.find((val) => {
        return val.id === id;
      });
      setSingleMikrotik(temp);
    }
  };

  const customerHandler = async (data) => {
    setIsloading(true);
    const subArea = document.getElementById("subAreaId").value;
    if (subArea === "") {
      return alert("সাব-এরিয়া সিলেক্ট করতে হবে");
    }
    const mikrotik = singleMikrotik?.id;
    const { ispOwner } = auth;
    const { Pname, Ppassword, Pprofile, Pcomment, ...rest } = data;
    const mainData = {
      customerId: "randon123",
      subArea: subArea,
      ispOwner: ispOwner.id,
      mikrotik: mikrotik,
      pppoe: {
        name: Pname,
        password: Ppassword,
        profile: Pprofile,
        comment: Pcomment,
      },
      ...rest,
    };
    console.log("Seinding Data: ", mainData);
    const response = await dispatch(postCustomer(mainData));
    if (response) {
      setIsloading(false);
      dispatch(fetchCustomer(ispOwner.id));
    }
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
                নতুন কাস্টমার অ্যাড করুন
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
                  status: "",
                  balance: "",
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
                        <FtextField type="text" label="নাম" name="name" />
                        <FtextField type="text" label="মোবাইল" name="mobile" />
                        <FtextField type="text" label="এড্রেস" name="address" />
                        <FtextField type="text" label="ইমেইল" name="email" />
                        <FtextField
                          type="text"
                          label="জাতীয় পরিচয়পত্র নং"
                          name="nid"
                        />
                        <div className="form-check customerFormCheck">
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
                        </div>

                        <div className="form-check customerFormCheck">
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
                        </div>
                      </div>
                      {/* section two */}
                      <div className="Section2">
                        <FtextField
                          type="text"
                          label="ব্যালান্স"
                          name="balance"
                        />
                        <FtextField
                          type="text"
                          label="মাসিক ফি"
                          name="monthlyFee"
                        />
                        <hr />
                        <p>এরিয়া সিলেক্ট করুন</p>
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
                        <br />
                        <p>
                          {subArea ? subArea.name + " এর - " : ""} সাব-এরিয়া
                          সিলেক্ট করুন
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

                        <hr />

                        <p>মাইক্রোটিক সিলেক্ট করুন</p>
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
                      </div>
                      <div className="section3">
                        <FtextField
                          type="text"
                          label="PPPoE নাম"
                          name="Pname"
                        />
                        <FtextField
                          type="text"
                          label="পাসওয়ার্ড"
                          name="Ppassword"
                        />
                        <FtextField
                          type="text"
                          label="প্রোফাইল"
                          name="Pprofile"
                        />
                        <FtextField
                          type="text"
                          label="কমেন্ট"
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
                        বাতিল করুন
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "সেভ করুন"}
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
