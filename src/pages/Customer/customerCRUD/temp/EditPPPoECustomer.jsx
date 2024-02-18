import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

//custom hook
import useISPowner from "../../../../hooks/useISPOwner";
import useDataInputOption from "../../../../hooks/useDataInputOption";

// internal imports
import "../../../collector/collector.css";
import "../../customer.css";
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";
import { editCustomer } from "../../../../features/apiCalls";
import InformationTooltip from "../../../../components/common/tooltipInformation/InformationTooltip";
import { informationEnBn } from "../../../../components/common/tooltipInformation/informationEnBn";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";

//divisional location
import divisionsJSON from "../../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../../bdAddress/bd-upazilas.json";
import getName from "../../../../utils/getLocationName";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thanas = thanaJSON.thana;

const EditPPPoECustomer = ({ show, setShow, single }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hook
  const { ispOwnerId, bpSettings } = useISPowner();

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // find editable data
  const data = customer.find((item) => item.id === single);

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // set customer modified data
  const [customerModifiedData, setCustomerModifiedData] = useState({});

  // customer auto disable state
  const [autoDisable, setAutoDisable] = useState(false);

  // customer next month auto disable state
  const [nextMonthAutoDisable, setNextMonthAutoDisable] = useState(false);

  // data set to state
  useEffect(() => {
    // set customer auto disable
    setAutoDisable(data?.autoDisable);

    // set customer next month auto disable
    setNextMonthAutoDisable(data?.nextMonthAutoDisable);

    // set customer data area id
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

  // call the data input option function
  const inputPermission = {
    customerId: true,
    mikrotik: true,
    mikrotikPackage: true,
    monthlyFee: true,
    balance: true,
    pppoeName: true,
    password: true,
    area: true,
    subArea: true,
    poleBox: true,
    name: true,
    mobile: true,
    birthDate: true,
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
    "edit",
    customerModifiedData
  );

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
      profile,
      comment,
      mobile,
      poleBox,
      promiseDate,
      thana,
      ...rest
    } = formValue;

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
      billingCycle,
      promiseDate,
      customerId,
      customerBillingType,
      autoDisable,
      nextMonthAutoDisable,
      mobile,
      poleBox,
      ...rest,
      pppoe: {
        name: pppoeName,
        password: password,
        service: "pppoe",
        comment: comment,
        profile: profile,
        disabled: data?.pppoe.disabled,
      },
    };

    // if billingCycle is greater than promiseDate then set promiseDate
    if (Date.parse(billingCycle) > Date.parse(promiseDate)) {
      mainData.promiseDate = billingCycle;
    }

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

    // if has mikrotik is empty then delete mikrotik
    if (!bpSettings?.hasMikrotik) {
      delete mainData.mikrotik;
    }

    // if poleBox is empty then delete poleBox
    if (!poleBox) {
      delete mainData.poleBox;
    }

    // sending data to api
    editCustomer(dispatch, mainData, setIsloading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        size="xl"
        header={data?.name + " " + t("editProfile")}
        footer={
          <div className="displayGrid1 float-end">
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
        }
      >
        <Formik
          initialValues={{
            ...dataInputOption?.inputInitialValues,
          }}
          validationSchema={dataInputOption?.validationSchema}
          onSubmit={(values) => {
            customerHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="customerEdit">
              <div className="displayGrid3">
                {dataInputOption?.inputOption.map(
                  (item) =>
                    item?.isVisible && <FtextField {...item} as={item.as} />
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
                            <InformationTooltip data={informationEnBn()?.[1]} />
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
      </ComponentCustomModal>
    </>
  );
};

export default EditPPPoECustomer;
