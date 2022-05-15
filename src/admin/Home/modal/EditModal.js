import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FtextField } from "../../../components/common/FtextField";
import { updateOwner } from "../../../features/apiCallAdmin";

const EditModal = ({ ownerId }) => {
  const data = useSelector((state) => state.admin.ispOwners);

  const getOwner = data.find((item) => item.id === ownerId);
  console.log(getOwner);

  //   const customerValidator = Yup.object({
  //     name: Yup.string().required("গ্রাহকের নাম লিখুন"),
  //     mobile: Yup.string()
  //       // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
  //       .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
  //       .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে"),
  //     address: Yup.string(),
  //     Pname: Yup.string().required("PPPoE নাম লিখুন"),
  //     Ppassword: Yup.string().required("PPPoE পাসওয়ার্ড লিখুন"),
  //     Pcomment: Yup.string(),
  //     // balance: Yup.number().integer(),
  //   });

  let initialValues;
  if (getOwner) {
    initialValues = {
      name: getOwner?.name,
      mobile: getOwner?.mobile,
      company: getOwner?.company,
      address: getOwner?.address,
      smsBalance: getOwner?.smsBalance,
      referenceName: getOwner?.reference?.name,
      referenceMobile: getOwner?.reference?.mobile,
      paymentStatus: getOwner?.bpSettings?.paymentStatus,
      packageType: getOwner?.bpSettings?.packType,
      package: getOwner?.bpSettings?.pack,
      packageRate: getOwner?.bpSettings?.packageRate,
      customerLimit: getOwner?.bpSettings?.customerLimit,
    };
  }

  const dispatch = useDispatch();

  const ownerHandler = (values) => {
    console.log(values);
    const bpSettings = { ...getOwner.bpSettings };
    if (values.packageRate) bpSettings.packageRate = values.packageRate;
    updateOwner(ownerId, values, dispatch);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="clientEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                এর প্রোফাইল এডিট করুন
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
                // initialValues={{
                // //   name: getOwner.name || "",
                //   mobile: getOwner.mobile || "",
                //   address: getOwner.address || "",
                //   email: getOwner.email || "",
                //   nid: getOwner.nid || "",
                //   Pcomment: getOwner.pppoe?.comment || "",
                //   //   monthlyFee: packageRate?.rate || getOwner.monthlyFee || 0,
                //   Pname: getOwner.pppoe?.name || "",
                //   //   Pprofile: packageRate?.name || getOwner.pppoe?.profile || "",
                //   Ppassword: getOwner?.pppoe?.password || "",
                //   //   status: status || "",
                //   balance: getOwner.balance || "",
                // }}
                initialValues={initialValues}
                // validationSchema={customerValidator}
                onSubmit={(values) => {
                  ownerHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    {/* <div className="pppoeSection2">
                      <FtextField type="text" label="নাম" name="name" />
                    </div>

                    <div className="displayGrid3">
                      <div>
                        <p>এরিয়া সিলেক্ট করুন</p>
                      </div>

                      <FtextField
                        type="text"
                        label="জাতীয় পরিচয়পত্র নং"
                        name="nid"
                      />
                    </div> */}

                    <div className="displayGrid3">
                      <FtextField type="text" label="নাম" name="name" />
                      <FtextField type="text" label="মোবাইল" name="mobile" />
                      <FtextField type="text" label="company" name="company" />
                      <FtextField type="text" label="ঠিকানা" name="address" />
                      <FtextField
                        type="text"
                        label="Package Rate"
                        name="packageRate"
                      />

                      <FtextField
                        type="text"
                        label="Customar Limit"
                        name="customerLimit"
                      />

                      <FtextField
                        type="text"
                        label="SMS Balance"
                        name="smsBalance"
                      />

                      <div>
                        <p>paid status</p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option
                            value="paid"
                            selected={
                              getOwner?.bpSettings?.paymentStatus === "paid"
                            }
                          >
                            Paid
                          </option>
                          <option
                            selected={
                              getOwner?.bpSettings?.paymentStatus === "unpaid"
                            }
                            value="unpaid"
                          >
                            Unpaid
                          </option>
                        </select>
                      </div>
                      <FtextField
                        type="text"
                        label="Package Type"
                        name="packageType"
                      />
                      <FtextField type="text" label="Package" name="package" />

                      {/* <div>
                        <p>Package Type</p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option
                            value="Basic"
                            selected={
                              getOwner?.bpSettings?.packType === "Basic"
                            }
                          >
                            Basic
                          </option>
                          <option
                            selected={
                              getOwner?.bpSettings?.packType === "Standard"
                            }
                            value="Standard"
                          >
                            Standard
                          </option>
                        </select>
                      </div> */}

                      {/* <div>
                        <p>Package</p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option
                            value="p1"
                            selected={getOwner?.bpSettings?.pack === "p1"}
                          >
                            P1
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p2"}
                            value="p2"
                          >
                            P2
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p3"}
                            value="p3"
                          >
                            P3
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p4"}
                            value="p4"
                          >
                            P4
                          </option>

                          <option
                            selected={getOwner?.bpSettings?.pack === "p5"}
                            value="p5"
                          >
                            P5
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p6"}
                            value="p6"
                          >
                            P6
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p7"}
                            value="p7"
                          >
                            P7
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p8"}
                            value="p8"
                          >
                            P8
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p9"}
                            value="p9"
                          >
                            P9
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p10"}
                            value="p10"
                          >
                            P10
                          </option>
                          <option
                            value="p11"
                            selected={getOwner?.bpSettings?.pack === "p11"}
                          >
                            P11
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p12"}
                            value="p12"
                          >
                            P12
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p13"}
                            value="p13"
                          >
                            P13
                          </option>
                          <option
                            selected={getOwner?.bpSettings?.pack === "p14"}
                            value="p14"
                          >
                            P14
                          </option>

                          <option
                            selected={getOwner?.bpSettings?.pack === "p15"}
                            value="p15"
                          >
                            P15
                          </option>
                        </select>
                      </div> */}
                      <FtextField
                        type="text"
                        label="Reference Name"
                        name="referenceName"
                      />

                      <FtextField
                        type="text"
                        label="Reference Mobile"
                        name="referenceMobile"
                      />
                    </div>

                    {/* <div className="newDisplay">
                      <FtextField type="text" label="ইমেইল" name="email" />

                      <div className="billCycle">
                        <p className="customerFieldsTitle">বিলিং সাইকেল</p>
                      </div>
                    </div>

                    <div className="pppoeStatus">
                      <p>স্ট্যাটাস</p>
                    </div> */}

                    <div className="modal-footer" style={{ border: "none" }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        বাতিল করুন
                      </button>
                      <button type="submit" className="btn btn-success">
                        সেভ করুন
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
};

export default EditModal;
