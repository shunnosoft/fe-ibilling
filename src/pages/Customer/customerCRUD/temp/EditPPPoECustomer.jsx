import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

// internal imports
import "../../../collector/collector.css";
import "../../customer.css";
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";

//divisional location
import divisionsJSON from "../../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../../bdAddress/bd-upazilas.json";
import getName, { getNameId } from "../../../../utils/getLocationName";

//custom hook
import useISPowner from "../../../../hooks/useISPOwner";
import {
  editCustomer,
  fetchMikrotik,
  fetchPackagefromDatabase,
} from "../../../../features/apiCalls";
import useDataInputOption from "../../../../hooks/useDataInputOption";
import InformationTooltip from "../../../../components/common/tooltipInformation/InformationTooltip";
import { informationEnBn } from "../../../../components/common/tooltipInformation/informationEnBn";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thanas = thanaJSON.thana;

const EditPPPoECustomer = ({ show, setShow, single }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hook
  const { ispOwnerId, hasMikrotik } = useISPowner();

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // get all area
  const area = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // get mikrotiks
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get pppoe package
  const ppPackage = useSelector((state) =>
    hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  // get subarea poleBox
  const poleBox = useSelector((state) => state.area?.poleBox);

  // find editable data
  const data = customer.find((item) => item.id === single);

  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [isLoadingPole, setIsLoadingPole] = useState(false);
  const [mikrotikPackage, setMikrotikPackage] = useState("");

  const [autoDisable, setAutoDisable] = useState(data?.autoDisable || false);
  const [nextMonthAutoDisable, setNextMonthAutoDisable] = useState(
    data?.nextMonthAutoDisable || false
  );

  const [subArea, setSubArea] = useState([]);

  const [activeStatus, setActiveStatus] = useState(data?.pppoe?.disabled);
  const [mikrotikName, setmikrotikName] = useState("");
  const [areaID, setAreaID] = useState("");
  const [subAreaId, setSubAreaId] = useState("");
  const [connectionDate, setConnectionDate] = useState("");
  const [billDate, setBillDate] = useState();
  // const [status, setStatus] = useState("");
  const [promiseDate, setPromiseDate] = useState(null);
  const [subAreasPoleBox, setSubAreasPoleBox] = useState([]);
  const [poleBoxIds, setPoleBoxIds] = useState("");
  const [poleBoxId, setPoleBoxId] = useState("");

  const [packageId, setPackageId] = useState("");

  //component states
  const [_loading, setLoading] = useState(false);

  // set customer modified data
  const [customerModifiedData, setCustomerModifiedData] = useState({});

  // set divisional area in state
  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  //last day of month calculation
  let day = new Date(data?.promiseDate);
  let lastDayOfMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0);

  let initialTime = new Date();
  initialTime.setHours("00");
  initialTime.setMinutes("00");

  //hour and minutes calculation
  let lastTime = new Date();
  lastTime.setHours("18");
  lastTime.setMinutes("00");

  useEffect(() => {
    // set customer bill date in state
    setBillDate(new Date(data?.billingCycle));

    // set customer promise date in state
    setPromiseDate(new Date(data.promiseDate));

    // set customer auto connection in state
    setAutoDisable(data?.autoDisable);

    //
    setPackageId(data?.mikrotikPackage);
    // setStatus(data?.status);
    setConnectionDate(
      data?.connectionDate ? new Date(data?.connectionDate) : null
    );
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: data?.mikrotik,
    };

    if (bpSettings?.hasMikrotik) {
      fetchPackagefromDatabase(dispatch, IDs, setIsloading);
    }

    setAutoDisable(data?.autoDisable);
    setNextMonthAutoDisable(data?.nextMonthAutoDisable);

    //select customer district,division and thana for sync with state
    const divisionalInfo = {};
    if (data?.division) {
      const division = divisions.find((item) => item.name === data.division);
      divisionalInfo.division = division.id;
    }
    if (data?.district) {
      const district = districts.find((item) => item.name === data.district);
      divisionalInfo.district = district?.id;
    }
    if (data?.thana) {
      const findThana = thanas.find(
        (item) =>
          item.name === data.thana &&
          item.district_id === divisionalInfo.district
      );
      divisionalInfo.thana = findThana?.id;
    }
    setDivisionalArea({
      ...divisionalArea,
      ...divisionalInfo,
    });
  }, [bpSettings, ispOwnerId, data]);

  useEffect(() => {
    const temp = mikrotiks.find((val) => val.id === data?.mikrotik);
    setmikrotikName(temp);
  }, [mikrotiks, data, ispOwnerId]);

  useEffect(() => {
    fetchMikrotik(dispatch, ispOwnerId, setLoading);
  }, [ispOwnerId]);

  useEffect(() => {
    storeSubArea?.map((sub) => {
      if (sub?.id === data?.subArea) {
        const customerData = {
          ...data,
          area: sub.area,
        };
        setCustomerModifiedData(customerData);
      }
    });
  }, [data]);

  useEffect(() => {
    const division_id = getNameId(divisions, data?.division)?.id;
    const district_id = getNameId(districts, data?.district)?.id;
    const thana_id = getNameId(thanas, data?.thana)?.id;
    setDivisionalArea({
      division: division_id,
      district: district_id,
      thana: thana_id,
    });
  }, [data]);

  useEffect(() => {
    let temp;
    area.map((a) => {
      a.subAreas.map((sub) => {
        if (sub === data?.subArea) {
          setAreaID(a.id);
          temp = a.id;
        }
        return sub;
      });
      return a;
    });
    setSubAreaId(data?.subArea);
    setPoleBoxId(data?.poleBox);
    const initialSubAreas = storeSubArea.filter((val) => val.area === temp);
    setSubArea(initialSubAreas);

    const subPoleBox = poleBox.filter((val) => {
      return val.subArea === data?.subArea;
    });
    setSubAreasPoleBox(subPoleBox);
  }, [area, data, storeSubArea]);

  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.number()
      .integer()
      .min(0, t("minimumPackageRate"))
      .required(t("enterPackageRate")),
    pppoeName: Yup.string().required(t("writePPPoEName")),
    password: Yup.string().required(t("writePPPoEPassword")),
    comment: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),
    connectionFee: Yup.number(),
  });

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  // select Mikrotik Package
  useEffect(() => {
    const mikrotikPackageId = data?.mikrotikPackage;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.name === mikrotikPackageId);
    setPackageRate(temp);
  }, [data, ppPackage]);

  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    setPackageId(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };

  // select subArea
  const selectSubArea = (data) => {
    const areaId = data.target.value;

    if (areaId) {
      const temp = storeSubArea.filter((val) => {
        return val.area === areaId;
      });
      setAreaID(areaId);
      setSubArea(temp);
    }
  };

  // sending data to backed
  const customerHandler = async (formValue) => {
    const {
      billingCycle,
      customerId,
      customerBillingType,
      district,
      division,
      pppoeName,
      password,
      comment,
      mobile,
      mikrotikPackage,
      promiseDate,
      thana,
      ...rest
    } = formValue;

    // find single mikrotik package in pppoe package list
    const Pprofile = ppPackage.find((val) => val.id === mikrotikPackage)?.name;

    // if customer id is empty then alert write customer id
    if (!bpSettings.genCustomerId) {
      if (customerId === "") {
        setIsloading(false);
        return alert(t("writeCustomerId"));
      }
    }

    // if mobile number is empty then alert write mobile number
    if (bpSettings?.addCustomerWithMobile) {
      if (mobile === "") {
        setIsloading(false);
        return alert(t("writeMobileNumber"));
      }
    }

    // if payment status is unpaid and customer status is active and customer type is prepaid then alert recharge
    if (
      data?.paymentStatus === "unpaid" &&
      data?.status === "active" &&
      data?.customerBillingType === "prepaid"
    ) {
      if (customerBillingType === "postpaid") {
        setIsloading(false);
        return toast.warn(t("rechargeYourCustomer"));
      }
    }

    // customer modification sending data to api
    const mainData = {
      singleCustomerID: data?.id,
      ispOwner: ispOwnerId,
      connectionDate,
      mikrotikPackage,
      autoDisable,
      nextMonthAutoDisable,
      billingCycle: billingCycle.toISOString(),
      promiseDate: promiseDate.toISOString(),
      pppoe: {
        name: pppoeName,
        password: password,
        service: "pppoe",
        comment: comment,
        profile: Pprofile,
        disabled: activeStatus,
      },
      ...rest,
    };

    // set the value of division district and thana dynamically
    if (district || division || thana) {
      const divisionName = getName(divisions, division)?.name;
      const districtName = getName(districts, district)?.name;
      const thanaName = getName(thanas, thana)?.name;

      //if  exist add the data
      if (divisionName) mainData.division = divisionName;
      if (districtName) mainData.district = districtName;
      if (thanaName) mainData.thana = thanaName;
    }

    // if balance is empty then delete balance
    if (
      mainData.balance === "" ||
      mainData.balance === undefined ||
      mainData === null
    ) {
      delete mainData.balance;
    }

    // if bpsettings genCustomerId is false then add customerId
    if (!bpSettings.genCustomerId) {
      mainData.customerId = customerId;
    }

    // if poleBox is empty then delete poleBox
    if (!poleBoxIds) {
      delete mainData.poleBox;
    }

    // sending data to api
    editCustomer(dispatch, mainData, setIsloading, setShow);
  };

  const selectedSubArea = (e) => {
    var subArea = e.target.value;
    area.map((a) => {
      a.subAreas.map((sub) => {
        if (sub === subArea) {
          setAreaID(a.id);
          setSubAreaId(subArea);
        }
        return sub;
      });
      return a;
    });

    // subArea poleBox
    const subAreaPoleBox = poleBox.filter((val) => {
      return val.subArea === subArea;
    });
    setSubAreasPoleBox(subAreaPoleBox);
  };

  // call the data input option function
  const inputPermission = {
    mikrotik: true,
    mikrotikPackage: true,
    monthlyFee: true,
    balance: true,
    pppoeName: true,
    password: true,
    area: true,
    subArea: true,
    polebox: true,
    name: true,
    mobile: true,
    nid: true,
    address: true,
    email: true,
    billingCycle: true,
    promiseDate: true,
    connectionDate: true,
    connectionFee: true,
    customerBillingType: true,
    division: true,
    district: true,
    thana: true,
    comment: true,
    status: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    "pppoe",
    customerModifiedData
  );

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title" id="exampleModalLabel">
              {data?.name} {t("editProfile")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              area: customerModifiedData?.area,
              address: data?.address || "N/A",
              billingCycle: new Date(data?.billingCycle),
              balance: data?.balance || 0,
              connectionFee: data?.connectionFee || 0,
              customerBillingType: data?.customerBillingType || "",
              customerId: data?.customerId,
              connectionDate: data?.connectionDate
                ? new Date(data?.connectionDate)
                : "",
              comment: data?.pppoe?.comment || "N/A",
              division: divisionalArea.division || "",
              district: divisionalArea.district || "",
              email: data?.email || "",
              subArea: data?.subArea,
              mikrotik: data?.mikrotik || "",
              mikrotikPackage: data?.mikrotikPackage,
              mobile: data?.mobile || "",
              monthlyFee: data?.monthlyFee || 0,
              name: data?.name,
              nid: data?.nid || "N/A",
              pppoeName: data?.pppoe?.name || "",
              promiseDate: new Date(data?.promiseDate),
              password: data?.pppoe?.password || "",
              status: data?.status || "",
              thana: divisionalArea.thana || "",
            }}
            validationSchema={customerValidator}
            onSubmit={(values) => {
              customerHandler(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form id="customerEdit">
                <div className="displayGrid3">
                  {dataInputOption?.map(
                    (item) =>
                      item?.isVisible && (
                        <FtextField
                          as={item.as}
                          name={item?.name}
                          type={item?.type}
                          disabled={item.disabled}
                          validation={item.validation}
                          label={item?.label}
                          placeholder={item?.placeholder}
                          firstOptions={item?.firstOptions}
                          textAccessor={item.textAccessor}
                          valueAccessor={item.valueAccessor}
                          options={item.options}
                          value={item?.value}
                          onChange={item?.onChange}
                          component={item?.component}
                          inputField={item?.inputField}
                          selected={item?.selected}
                          dateFormat={item?.dateFormat}
                          timeIntervals={item?.timeIntervals}
                          showTimeSelect={item?.showTimeSelect}
                        />
                      )
                  )}

                  {bpSettings?.hasMikrotik && (
                    <div>
                      <label className="changeLabelFontColor">
                        {t("automaticConnectionOff")}
                      </label>

                      <div className="displayGrid2">
                        <div className="customerAutoDisable">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            name="autoDisable"
                            id="autoDisable"
                            checked={autoDisable}
                            disabled={nextMonthAutoDisable}
                            onChange={(e) => setAutoDisable(e.target.checked)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="autoDisable"
                          >
                            {t("willContinue")}
                          </label>
                        </div>

                        {data.balance <= 0 && (
                          <div className="d-flex align-items-center">
                            <div className="customerAutoDisable">
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                name="autoDisable"
                                id="nextMonthAutoDisable"
                                checked={nextMonthAutoDisable}
                                disabled={autoDisable}
                                onChange={(e) =>
                                  setNextMonthAutoDisable(e.target.checked)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="nextMonthAutoDisable"
                              >
                                {t("nextMonth")}
                              </label>
                            </div>

                            {/* there is information to grant permission tooltip */}
                            {informationEnBn()?.[1] && (
                              <InformationTooltip
                                data={informationEnBn()?.[1]}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              form="customerEdit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("save")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditPPPoECustomer;
