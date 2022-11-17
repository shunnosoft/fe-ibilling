import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FtextField } from "../../../components/common/FtextField";
import { updateOwner } from "../../../features/apiCallAdmin";
import Loader from "../../../components/common/Loader";
import moment from "moment";

const ISPOwnerEditModal = ({ ownerId }) => {
  // import dispatch from react redux
  const dispatch = useDispatch();

  //  get all isp owner
  const data = useSelector((state) => state.admin?.ispOwners);

  // get editable owner
  const ispOwner = data.find((item) => item.id === ownerId);

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  const [billDate, setBillDate] = useState();

  const role = useSelector((state) => state.persistedReducer.auth?.role);

  useEffect(() => {
    setBillDate(
      moment(ispOwner?.bpSettings?.monthlyDueDate).format("YYYY-MM-DD")
    );
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
    referenceName: Yup.string(),
    referenceMobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে"),
    paymentStatus: Yup.string().required("পেমেন্ট স্ট্যাটাস দিন"),
    queueType: Yup.string().required("queueType দিন"),
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
      queueType: ispOwner?.bpSettings?.queueType,
      packType: ispOwner?.bpSettings?.packType,
      pack: ispOwner?.bpSettings?.pack,
      packageRate: ispOwner?.bpSettings?.packageRate,
      customerLimit: ispOwner?.bpSettings?.customerLimit,
      hasMikrotik: ispOwner?.bpSettings?.hasMikrotik,
    };
  }

  //  handle submit
  const ownerHandler = (values) => {
    //  delete id & mobile from value
    delete values.id;
    delete values.mobile;

    // send data to api
    const data = {
      name: values.name,
      company: values.company,
      address: values.address,

      bpSettings: {
        ...ispOwner.bpSettings,
        packageRate: Number.parseInt(values.packageRate),
        customerLimit: Number.parseInt(values.customerLimit),
        packType: values.packType,
        pack: values.pack,
        queueType: values.queueType,
        hasMikrotik: values.hasMikrotik,
        monthlyDueDate: billDate,
      },
      reference: {
        ...ispOwner.reference,
        mobile: values.referenceMobile,
      },
    };

    if (role === "superadmin") {
      data.smsBalance = values.smsBalance;
      data.bpSettings.paymentStatus = values.paymentStatus;
      data.reference.name = values.referenceName;
    }

    if (role === "admin") {
      if (
        Number.parseInt(values.packageRate) < ispOwner.bpSettings.packageRate
      ) {
        alert("রেট কমানো সম্ভব নয়");
        return;
      }
      if (
        Number.parseInt(values.customerLimit) <
        ispOwner.bpSettings.customerLimit
      ) {
        alert("লিমিট কমানো সম্ভব নয়");
        return;
      }
    }

    data.bpSettings.monthlyDueDate = moment(data.bpSettings.monthlyDueDate).set(
      {
        hour: 23,
        minute: 59,
        second: 0,
        millisecond: 0,
      }
    );

    // console.log(data);
    // return;

    // api call
    updateOwner(ownerId, data, setIsLoading, dispatch);
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
              <div className="modal-title" id="exampleModalLabel">
                <div className="d-flex">
                  <h5>
                    Id: <span className="text-success"> {ispOwner?.id} </span>
                  </h5>
                  <h5 className="ms-5">
                    Mobile:
                    <span className="text-success"> {ispOwner?.mobile}</span>
                  </h5>
                </div>
              </div>
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
                    <div className="displayGrid3">
                      <FtextField type="text" label="Name" name="name" />
                      <FtextField type="text" label="Company" name="company" />
                      <FtextField type="text" label="Adress" name="address" />
                    </div>

                    <div className="displayGrid3">
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

                      {role === "superadmin" && (
                        <FtextField
                          type="text"
                          label="SMS Balance"
                          name="smsBalance"
                        />
                      )}
                    </div>
                    <div className="displayGrid3">
                      <div>
                        <h6 className="mb-0">Package Type</h6>
                        <Field
                          as="select"
                          name="packType"
                          className="form-select mt-1 mb-4"
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
                            value="Standard"
                            selected={
                              ispOwner?.bpSettings?.packType === "Standard"
                            }
                          >
                            Standard
                          </option>
                        </Field>
                      </div>

                      <div>
                        <h6 className="mb-0">Package</h6>
                        <Field
                          as="select"
                          className="form-select"
                          aria-label="Default select example"
                          name="pack"
                        >
                          <option value="P1">P1</option>
                          <option value="P2">P2</option>
                          <option value="P3">P3</option>
                          <option value="P4">P4</option>
                          <option value="P5">P5</option>
                          <option value="P6">P6</option>
                          <option value="P7">P7</option>
                          <option value="P8">P8</option>
                          <option value="P9">P9</option>
                          <option value="P10">P10</option>
                          <option value="P11">P11</option>
                          <option value="P12">P12</option>
                          <option value="P13">P13</option>
                          <option value="P14">P14</option>
                          <option value="P15">P15</option>
                        </Field>
                      </div>

                      {role === "superadmin" && (
                        <div>
                          <h6 className="mb-0">Paid status</h6>
                          <Field
                            as="select"
                            className="form-select mt-1 mb-4"
                            aria-label="Default select example"
                            name="paymentStatus"
                          >
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                          </Field>
                        </div>
                      )}

                      <div>
                        <h6 className="mb-0">Queue Type</h6>
                        <Field
                          as="select"
                          className="form-select mt-1 mb-4"
                          aria-label="Default select example"
                          name="queueType"
                        >
                          <option value="simple-queue">Simple Queue</option>
                          <option value="firewall-queue">Firewall Queue</option>
                        </Field>
                      </div>

                      <div className="monthlyDueDate">
                        <p className="customerFieldsTitle">ইনভয়েস ডেট</p>

                        <div className="timeDate">
                          <Field
                            value={billDate}
                            onChange={(e) => setBillDate(e.target.value)}
                            type="date"
                            name="monthlyDueDate"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="displayGrid3">
                      {role === "superadmin" && (
                        <FtextField
                          type="text"
                          label="Reference Name"
                          name="referenceName"
                        />
                      )}

                      <FtextField
                        type="text"
                        label="Reference Mobile"
                        name="referenceMobile"
                      />
                      <div className="form-check mt-4">
                        <Field
                          className="form-check-input"
                          type="checkbox"
                          id="flexCheckChecked"
                          name="hasMikrotik"
                        />
                        <label
                          className="form-check-label"
                          for="flexCheckChecked"
                        >
                          Has Mikrotik
                        </label>
                      </div>
                      <div className="form-check mt-4">
                        <Field
                          className="form-check-input"
                          type="checkbox"
                          id="inventory"
                          name="inventory"
                        />
                        <label className="form-check-label" for="inventory">
                          Has Inventory
                        </label>
                      </div>
                    </div>

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
                        Cancel
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
