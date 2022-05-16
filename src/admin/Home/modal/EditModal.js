import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FtextField } from "../../../components/common/FtextField";
import { updateOwner } from "../../../features/apiCallAdmin";
import Loader from "../../../components/common/Loader";

const ISPOwnerEditModal = ({ ownerId }) => {
  //  get all isp owner
  const data = useSelector((state) => state.admin.ispOwners);

  // get editable owner
  const ispOwner = data.find((item) => item.id === ownerId);

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  // import dispatch from react redux
  const dispatch = useDispatch();

  //  set payment status paid or unpain in local state
  const [paymentStatus, setPaymentStatus] = useState(
    ispOwner?.bpSettings?.paymentStatus
  );

  //  set mickrotik status true or flase
  const [hasMikrotik, setHasMikrotik] = useState(
    ispOwner?.bpSettings?.hasMikrotik
  );

  //  set payment status & mikrotik
  useEffect(() => {
    if (ispOwner) {
      setPaymentStatus(ispOwner?.bpSettings?.paymentStatus);
      setHasMikrotik(ispOwner?.bpSettings?.hasMikrotik);
    }
  }, [ispOwner]);

  //  isp owner form validation
  const ispOwnerValidator = Yup.object({
    name: Yup.string().required("আই এস পি ওনারের নাম দিন"),
    mobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে"),
    company: Yup.string().required("কোম্পানির নাম দিন"),
    address: Yup.string().required("ঠিকানা দিন"),
    smsBalance: Yup.string().required("এস এম এস এর পরিমান দিন "),
    referenceName: Yup.string().required("রেফারেন্স এর নাম দিন "),
    referenceMobile: Yup.string()
      .required("মোবাইল নাম্বার দিন")
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে"),
    paymentStatus: Yup.string().required("পেমেন্ট স্ট্যাটাস দিন"),
    packType: Yup.string().required("প্যাকেজ টাইপ দিন"),
    pack: Yup.string().required("প্যাকেজ দিন"),
    customerLimit: Yup.string().required("কাস্টমার লিমিট দিন"),
    packageRate: Yup.string().required("প্যাকেজ রেট দিন"),
    hasMikrotik: Yup.string(),
  });

  //  set initial form values
  let initialValues;
  if (ispOwner) {
    initialValues = {
      ispOwnerId: ispOwner?.id,
      name: ispOwner?.name,
      mobile: ispOwner?.mobile,
      company: ispOwner?.company,
      address: ispOwner?.address,
      smsBalance: ispOwner?.smsBalance,
      referenceName: ispOwner?.reference?.name,
      referenceMobile: ispOwner?.reference?.mobile,
      paymentStatus: ispOwner?.bpSettings?.paymentStatus,
      packType: ispOwner?.bpSettings?.packType,
      pack: ispOwner?.bpSettings?.pack,
      packageRate: ispOwner?.bpSettings?.packageRate,
      customerLimit: ispOwner?.bpSettings?.customerLimit,
      hasMikrotik: ispOwner?.bpSettings?.hasMikrotik,
    };
  }

  //  checked mikrotik
  const handleHasMikrotikChange = (e) => {
    //  check mikrotik
    const { checked } = e.target;
    setHasMikrotik(checked);
  };

  //  checked payment status
  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  //  handle submit
  const ownerHandler = (values) => {
    //  delete id & mobile from value
    delete values.id;
    delete values.mobile;

    //  set bpSetting & references
    const bpSettings = { ...ispOwner.bpSettings };
    const reference = { ...ispOwner.reference };

    //  convert package rate string to int
    if (values.packageRate)
      bpSettings.packageRate = Number.parseInt(values.packageRate);

    //  convert customer limit string to int
    if (values.customerLimit)
      bpSettings.customerLimit = Number.parseInt(values.customerLimit);

    //  set package type to bpSetting
    if (values.packType) bpSettings.packType = values.packType;

    //  set pack to bpSetting
    if (values.pack) bpSettings.pack = values.pack;

    //  set payment status to bpSetting
    if (paymentStatus) bpSettings.paymentStatus = paymentStatus;

    //  set mikrotik status for bpSetting
    bpSettings.hasMikrotik = hasMikrotik;

    //  set references mobile
    if (values.referenceMobile) reference.mobile = values.referenceMobile;

    //  set references name
    if (values.referenceName) reference.name = values.referenceName;

    //  update bpSetting & references
    values.bpSettings = bpSettings;
    values.reference = reference;

    // api call
    updateOwner(ownerId, values, setIsLoading, dispatch);
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
                Edit Profile
                <span className="text-success"> {ispOwner?.name}</span>
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
                initialValues={initialValues}
                validationSchema={ispOwnerValidator}
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
                      <FtextField
                        type="text"
                        label="ISP Owner Id"
                        name="ispOwnerId"
                        disabled
                      />
                      <FtextField type="text" label="Name" name="name" />
                      <FtextField
                        type="text"
                        label="Mobile"
                        name="mobile"
                        disabled
                      />
                    </div>

                    <div className="displayGrid3">
                      <FtextField type="text" label="Company" name="company" />
                      <FtextField type="text" label="Adress" name="address" />
                      <FtextField
                        type="text"
                        label="Package Rate"
                        name="packageRate"
                      />
                    </div>
                    <div className="displayGrid3">
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
                      <FtextField
                        type="text"
                        label="Package Type"
                        name="packType"
                      />
                    </div>
                    <div className="displayGrid3">
                      <FtextField type="text" label="Package" name="pack" />

                      <div>
                        <h6 className="mb-0">Paid status</h6>
                        <select
                          className="form-select mt-1 mb-4"
                          aria-label="Default select example"
                          onChange={handlePaymentStatusChange}
                        >
                          <option
                            value="paid"
                            selected={paymentStatus === "paid"}
                          >
                            Paid
                          </option>
                          <option
                            selected={paymentStatus === "unpaid"}
                            value="unpaid"
                          >
                            Unpaid
                          </option>
                        </select>
                      </div>

                      <div class="form-check mt-4">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="flexCheckChecked"
                          name="hasMikrotik"
                          checked={hasMikrotik}
                          onChange={handleHasMikrotikChange}
                        />
                        <label class="form-check-label" for="flexCheckChecked">
                          Has Microtik
                        </label>
                      </div>
                    </div>
                    <div className="displayGrid3">
                      {/* <div className="CheckboxContainer">
                        <input
                          type="checkbox"
                          className="CheckBox"
                          name="hasMikrotik"
                          checked={hasMikrotik}
                          onChange={handleHasMikrotikChange}
                        />
                        <label className="checkboxLabel">Has Mikrotik</label>
                      </div> */}

                      {/* <div>
                        <p>Package Type</p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option
                            value="Basic"
                            selected={
                              ispOwner?.bpSettings?.packType === "Basic"
                            }
                          >
                            Basic
                          </option>
                          <option
                            selected={
                              ispOwner?.bpSettings?.packType === "Standard"
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
                            selected={ispOwner?.bpSettings?.pack === "p1"}
                          >
                            P1
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p2"}
                            value="p2"
                          >
                            P2
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p3"}
                            value="p3"
                          >
                            P3
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p4"}
                            value="p4"
                          >
                            P4
                          </option>

                          <option
                            selected={ispOwner?.bpSettings?.pack === "p5"}
                            value="p5"
                          >
                            P5
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p6"}
                            value="p6"
                          >
                            P6
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p7"}
                            value="p7"
                          >
                            P7
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p8"}
                            value="p8"
                          >
                            P8
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p9"}
                            value="p9"
                          >
                            P9
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p10"}
                            value="p10"
                          >
                            P10
                          </option>
                          <option
                            value="p11"
                            selected={ispOwner?.bpSettings?.pack === "p11"}
                          >
                            P11
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p12"}
                            value="p12"
                          >
                            P12
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p13"}
                            value="p13"
                          >
                            P13
                          </option>
                          <option
                            selected={ispOwner?.bpSettings?.pack === "p14"}
                            value="p14"
                          >
                            P14
                          </option>

                          <option
                            selected={ispOwner?.bpSettings?.pack === "p15"}
                            value="p15"
                          >
                            P15
                          </option>
                        </select>
                      </div> */}
                    </div>
                    <div className="displayGrid3">
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
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "Submit"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        Cnacel
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

export default ISPOwnerEditModal;
