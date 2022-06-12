import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editCustomer } from "../../../features/apiCallReseller";
import { useEffect } from "react";
import apiLink from "../../../api/apiLink";
import moment from "moment";
import { toast } from "react-toastify";
export default function CustomerEdit({ single }) {
  const customer = useSelector(
    (state) => state?.persistedReducer?.customer?.customer
  );

  const data = customer.find((item) => item.id === single);

  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.ispOwner
  );
  const resellerId = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.id
  );
  const area = useSelector((state) => state?.persistedReducer?.area?.area);
  const Getmikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );
  const [ppPackage, setppPackage] = useState([]);
  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [mikrotikPackage, setMikrotikPackage] = useState(data?.mikrotikPackage);
  const [autoDisable, setAutoDisable] = useState(data?.autoDisable);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  const [activeStatus, setActiveStatus] = useState(data?.pppoe?.disabled);
  const [mikrotikName, setmikrotikName] = useState("");
  const [areaID, setAreaID] = useState("");
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();
  const [status, setStatus] = useState("");

  useEffect(() => {
    setAreaID(data?.subArea);
    setStatus(data?.status);
    setAutoDisable(data?.autoDisable);

    setSubArea(data?.subArea);
    setBillDate(moment(data?.billingCycle).format("YYYY-MM-DD"));
    setBilltime(moment(data?.billingCycle).format("HH:mm"));
    const temp = Getmikrotik?.find((val) => val.id === data?.mikrotik);
    setmikrotikName(temp);
  }, [Getmikrotik, area, data, dispatch, ispOwnerId, ppPackage]);

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: data?.mikrotik,
    };
    const fetchPac = async () => {
      try {
        const res = await apiLink.get(
          `/mikrotik/ppp/package/${IDs.mikrotikId}`
        );
        setppPackage(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    data?.mikrotik && fetchPac();
  }, [ispOwnerId, data]);

  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required("গ্রাহকের নাম লিখুন"),
    mobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে"),
    address: Yup.string(),
    email: Yup.string().email("ইমেইল সঠিক নয়"),
    nid: Yup.string(),
    monthlyFee: Yup.string().required("মাসিক ফি লিখুন"),
    Pname: Yup.string().required("PPPoE নাম লিখুন"),
    Ppassword: Yup.string().required("PPPoE পাসওয়ার্ড লিখুন"),
    Pcomment: Yup.string(),
  });

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };
  useEffect(() => {
    //todo
    const mikrotikPackageId = data?.mikrotikPackage;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  }, [data, ppPackage]);

  // select subArea
  const selectSubArea = (data) => {
    setSubArea(data.target.value);
    setAreaID(data.target.value);
    // setAreaID(single?.subArea);
  };
  // sending data to backed
  const customerHandler = async (formValue) => {
    const { Pname, Ppassword, Pprofile, Pcomment, monthlyFee, ...rest } =
      formValue;
    if (Number(monthlyFee) < Number(packageRate.rate)) {
      return alert("বিল কমানো যাবে না");
    }
    const mainData = {
      singleCustomerID: data?.id,
      subArea: subArea,
      ispOwner: ispOwnerId,
      mikrotik: data?.mikrotik,
      mikrotikPackage: packageRate?.id,
      // billPayType: "prepaid",
      autoDisable: autoDisable,
      reseller: resellerId,
      billingCycle: moment(billDate + " " + billTime).format(
        "YYYY-MM-DDTHH:mm:ss.ms[Z]"
      ),
      pppoe: {
        name: Pname,
        password: Ppassword,
        service: "pppoe",
        comment: Pcomment,
        profile: Pprofile,
        disabled: activeStatus,
      },
      ...rest,

      status,
    };
    editCustomer(dispatch, mainData, setIsloading);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data?.name} - এর প্রোফাইল এডিট করুন
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
                  name: data?.name || "",
                  mobile: data?.mobile || "",
                  address: data?.address || "",
                  email: data?.email || "",
                  nid: data?.nid || "",
                  Pcomment: data?.pppoe?.comment || "",
                  monthlyFee: packageRate?.rate || data?.monthlyFee || "",
                  Pname: data?.pppoe?.name || "",
                  Pprofile: packageRate?.name || data?.pppoe?.profile || "",
                  Ppassword: data?.pppoe?.password || "",
                }}
                validationSchema={customerValidator}
                onSubmit={(values) => {
                  customerHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div className="mikrotikSection">
                      <div>
                        <p className="comstomerFieldsTitle">
                          মাইক্রোটিক সিলেক্ট করুন
                        </p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          // onChange={selectMikrotik}
                          disabled
                          value={data?.mikrotik || ""}
                        >
                          <option value={mikrotikName?.id || ""}>
                            {mikrotikName?.name || ""}
                          </option>
                        </select>
                      </div>

                      {/* pppoe package */}
                      <div>
                        <p className="comstomerFieldsTitle">
                          প্যাকেজ সিলেক্ট করুন
                        </p>
                        <select
                          className="form-select mb-3"
                          aria-label="Default select example"
                          onChange={selectMikrotikPackage}
                          value={mikrotikPackage}
                        >
                          {ppPackage &&
                            ppPackage?.map((val, key) => (
                              <option
                                selected={val.id === packageRate?.id}
                                key={key}
                                value={val.id || ""}
                              >
                                {val.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <FtextField
                        type="text"
                        label="মাসিক ফি"
                        name="monthlyFee"
                        min={packageRate?.rate || data?.monthlyFee}
                      />
                    </div>

                    <div className="pppoeSection2">
                      <FtextField type="text" label="PPPoE নাম" name="Pname" />
                      <FtextField
                        type="text"
                        label="পাসওয়ার্ড"
                        name="Ppassword"
                      />
                      <FtextField type="text" label="কমেন্ট" name="Pcomment" />
                    </div>

                    <div className="displayGrid3">
                      <div>
                        <p>এরিয়া সিলেক্ট করুন</p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={selectSubArea}
                        >
                          {area?.length === undefined
                            ? ""
                            : area?.map((val, key) => (
                                <option
                                  selected={val.id === areaID}
                                  key={key}
                                  value={val.id || ""}
                                >
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>

                      <FtextField
                        type="text"
                        label="জাতীয় পরিচয়পত্র নং"
                        name="nid"
                      />
                    </div>

                    <div className="displayGrid3">
                      <FtextField type="text" label="নাম" name="name" />
                      <FtextField type="text" label="মোবাইল" name="mobile" />
                      <FtextField type="text" label="ঠিকানা" name="address" />
                    </div>
                    <div className="newDisplay">
                      <FtextField type="text" label="ইমেইল" name="email" />

                      <div className="billCycle">
                        <p className="customerFieldsTitle">বিলিং সাইকেল</p>

                        <div className="timeDate">
                          <input
                            value={billDate}
                            onChange={(e) => setBillDate(e.target.value)}
                            type="date"
                            min={moment().format("YYYY-MM-DD")}
                          />
                          <input
                            className="billTime"
                            value={billTime}
                            onChange={(e) => setBilltime(e.target.value)}
                            type="time"
                          />
                        </div>
                      </div>
                      <div className="autoDisable">
                        <label>অটোমেটিক সংযোগ বন্ধ</label>
                        <input
                          type="checkBox"
                          checked={autoDisable}
                          onChange={(e) => setAutoDisable(e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="pppoeStatus">
                      <p>স্ট্যাটাস</p>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="staus"
                          value={"active"}
                          onChange={(e) => setStatus(e.target.value)}
                          checked={status === "active"}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineRadio1"
                        >
                          এক্টিভ
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="inlineRadio2"
                          value={"inactive"}
                          onChange={(e) => setStatus(e.target.value)}
                          checked={status === "inactive"}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineRadio2"
                        >
                          ইন-এক্টিভ
                        </label>
                      </div>
                      {data?.status === "expired" && (
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="inlineRadio2"
                            disabled
                            checked={status === "expired"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio2"
                          >
                            এক্সপায়ার্ড
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="modal-footer" style={{ border: "none" }}>
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
