import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
// import { editCustomer } from "../../../features/customerSlice";
// import { fetchCustomer } from "../../../features/customerSlice";
import Loader from "../../../components/common/Loader";
import { editCustomer } from "../../../features/apiCalls";
import { useEffect } from "react";
import apiLink from "../../../api/apiLink";
import moment from "moment";
export default function CustomerEdit({ single }) {
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const area = useSelector((state) => state.persistedReducer.area.area);
  const Getmikrotik = useSelector(
    (state) => state.persistedReducer.mikrotik.mikrotik
  );
  // const ppPackage = useSelector(state => state.mikrotik.pppoePackage);
  const [ppPackage, setppPackage] = useState([]);
  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  // const [singleMikrotik, setSingleMikrotik] = useState(single?.mikrotik);
  const [mikrotikPackage, setMikrotikPackage] = useState(
    single?.mikrotikPackage
  );
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  // const [pppoePacakage, setPppoePacakage] = useState([]);
  const [activeStatus, setActiveStatus] = useState(single?.pppoe?.disabled);
  const [mikrotikName, setmikrotikName] = useState("");
  const [areaID, setAreaID] = useState("");
  const [subAreaId, setSubAreaId] = useState("");
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();

  useEffect(() => {
    setBillDate(moment(single.billingCycle).format("YYYY-MM-DD"));
    setBilltime(moment(single.billingCycle).format("hh:mm"));
    const temp = Getmikrotik.find((val) => val.id === single.mikrotik);
    setmikrotikName(temp);

    // findout area id by sub area id
    const areaIDTemp = area.find((areaItem) => {
      return areaItem.subAreas.find((val) => {
        if (single.subArea === val.id) {
          setSubAreaId(val);
        }
        return areaItem;
      });
    });
    setAreaID(areaIDTemp);

    // single?.mikrotik && fetchpppoePackage(dispatch, IDs);
    // const filterPPPoEpacakage = ppPackage.filter((val) => val.mikrotik === id);
    // setPppoePacakage(filterPPPoEpacakage);
  }, [Getmikrotik, area, single, dispatch, ispOwnerId, ppPackage]);

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: single?.mikrotik,
    };
    const fetchPac = async () => {
      try {
        const res = await apiLink.get(
          `/mikrotik/PPPpackages/${IDs.ispOwner}/${IDs.mikrotikId}`
        );
        setppPackage(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    single?.mikrotik && fetchPac();
  }, [ispOwnerId, single]);

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

  // const [loadingPac, setLoadingPac] = useState(false);

  // select Getmikrotik
  // const selectMikrotik = (e) => {
  //   const id = e.target.value;
  //   if (id && ispOwnerId) {
  //     const IDs = {
  //       ispOwner: ispOwnerId,
  //       mikrotikId: id,
  //     };
  //     fetchpppoePackage(dispatch, IDs);
  //   }

  //   const getOneMikrotik = Getmikrotik.find((val) => val.id === id);
  //   setSingleMikrotik(getOneMikrotik.id);

  //   // set Pppoe Pacakage
  //   const filterPPPoEpacakage = ppPackage.filter((val) => val.mikrotik === id);
  //   setPppoePacakage(filterPPPoEpacakage);
  // };

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };

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

  // sending data to backed
  const customerHandler = async (data) => {
    setIsloading(true);
    const subArea2 = document.getElementById("subAreaIdFromEdit").value;
    if (subArea2 === "") {
      setIsloading(false);
      return alert("সাব-এরিয়া সিলেক্ট করতে হবে");
    }
    const { Pname, Ppassword, Pprofile, Pcomment, ...rest } = data;
    const mainData = {
      // customerId: "randon123",
      paymentStatus: "unpaid",
      singleCustomerID: single?.id,
      subArea: subArea2,
      ispOwner: ispOwnerId,
      mikrotik: single?.mikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
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
                {single?.name} - এর প্রোফাইল এডিট করুন
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
                  name: single?.name || "",
                  mobile: single?.mobile || "",
                  address: single?.address || "",
                  email: single?.email || "",
                  nid: single?.nid || "",
                  Pcomment: single?.pppoe?.comment || "",
                  monthlyFee: packageRate?.rate || single?.monthlyFee || "",
                  Pname: single?.pppoe?.name || "",
                  Pprofile: packageRate?.name || single?.pppoe?.profile || "",
                  Ppassword: single.pppoe?.password || "",
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
                          value={single?.mikrotik || ""}
                        >
                          <option value={mikrotikName?.id || ""}>
                            {mikrotikName?.name || ""}
                          </option>
                          {/* {Getmikrotik.length === undefined
                            ? ""
                            : Getmikrotik.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))} */}
                        </select>
                      </div>

                      {/* pppoe package */}
                      <div>
                        <p className="comstomerFieldsTitle">
                          PPPoE প্যাকেজ সিলেক্ট করুন
                        </p>
                        <select
                          className="form-select mb-3"
                          aria-label="Default select example"
                          onChange={selectMikrotikPackage}
                          value={mikrotikPackage}
                        >
                          {/* <option value={single?.pppoe?.profile || "..."}>
                            {single?.pppoe?.profile || "..."}
                          </option> */}
                          {ppPackage?.map((val, key) => (
                            <option key={key} value={val.id || ""}>
                              {val.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <FtextField
                        type="text"
                        label="মাসিক ফি"
                        name="monthlyFee"
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
                          <option value={areaID?.id || ""}>
                            {areaID?.name || ""}
                          </option>
                          {area.length === undefined
                            ? ""
                            : area.map((val, key) => (
                                <option key={key} value={val.id || ""}>
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>

                      <div>
                        <p>
                          {subArea ? subArea.name + " এর - " : ""} সাব-এরিয়া
                          সিলেক্ট করুন
                        </p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          name="subArea"
                          id="subAreaIdFromEdit"
                        >
                          <option value={subAreaId?.id || ""}>
                            {subAreaId?.name || ""}
                          </option>
                          {subArea?.subAreas
                            ? subArea.subAreas.map((val, key) => (
                                <option key={key} value={val.id || ""}>
                                  {val.name}
                                </option>
                              ))
                            : ""}
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
                          name="inlineRadioOptions"
                          onChange={() => setActiveStatus(false)}
                          defaultChecked={!activeStatus}
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
                          name="inlineRadioOptions"
                          id="inlineRadio2"
                          onChange={() => setActiveStatus(true)}
                          defaultChecked={activeStatus}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineRadio2"
                        >
                          ইন-এক্টিভ
                        </label>
                      </div>
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
