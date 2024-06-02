import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";
import { Tab, Tabs } from "react-bootstrap";
import { Form, Formik } from "formik";
import useDataInputOption from "../../../../hooks/useDataInputOption";
import { FtextField } from "../../../../components/common/FtextField";
import ResellerArea from "./ResellerArea";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ResellerPackage from "./ResellerPackage";
import useISPowner from "../../../../hooks/useISPOwner";
import Loader from "../../../../components/common/Loader";
import ResellerPermission from "./ResellerPermission";
import { resellerPermissions } from "../resellerPermission";
import { toast } from "react-toastify";
import { editReseller } from "../../../../features/apiCalls";

const ResellerEdit = ({ show, setShow, resellerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // call the data input option function
  const inputPermission = {
    name: true,
    mobile: true,
    address: true,
    email: true,
    nid: true,
    website: true,
    status: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(inputPermission, null);

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  // get resellers data from redux store
  const resellers = useSelector((state) => state?.reseller?.reseller);

  // get all subarea form redux store
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // find single reseller resellers data
  const reseller = resellers?.find((val) => val.id === resellerId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // ispOwner all areas state
  const [areaSubareas, setAreaSubareas] = useState([]);

  // reseller commission type
  const [commissionType, setCommissionType] = useState("global");

  // reseller package rate type
  const [packageBasedType, setPackageBasedType] = useState("percentage");

  // commission share in isp & reseller state
  const [ispCommission, setIspCommission] = useState();
  const [resellerCommission, setResellerCommission] = useState();

  // package commission
  const [packageCommission, setPackageCommission] = useState([]);

  // reseller mikrotik
  const [resellerMikrotik, setResellerMikrotik] = useState([]);

  // reseller package rates
  const [resellerPackage, setResellerPackage] = useState([]);

  // reseller permission
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    setIspCommission(reseller?.commissionRate?.isp);
    setResellerCommission(reseller?.commissionRate?.reseller || 1);
    setIspCommission(reseller?.commissionRate?.isp || 99);
    setCommissionType(reseller?.commissionType);
    setPackageBasedType(reseller?.commissionStyle);
    setPackageCommission(reseller?.resellerPackageRates);

    // set reseller subAreas checked key include
    let temp = [];

    storeSubArea?.map((sub) => {
      if (reseller?.subAreas.includes(sub?.id)) {
        let subarea = {
          ...sub,
          isChecked: true,
        };
        temp.push(subarea);
      } else {
        let subarea = {
          ...sub,
          isChecked: false,
        };
        temp.push(subarea);
      }
    });

    // set ispOwner subAreas checked key include
    setAreaSubareas(temp);

    // set reseller permission key include
    const perms = resellerPermissions(reseller.permission, bpSettings);
    const filterdPermission = perms.filter((p) => p.disabled === false);
    setPermissions(filterdPermission);
  }, [reseller]);

  // reseller validation
  const resellerValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("writeMobileNumber")),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    website: Yup.string(),
    address: Yup.string(),
    status: Yup.string().required(t("selectStatus")),
  });

  // reseller profile, area,package and permission data submit handler
  const resellerProfileHandler = (data) => {
    // temporary state set reseller permission isChecked
    const permissionData = {};
    permissions.forEach((item) => {
      permissionData[item.value] = item.isChecked;
    });

    // reseller update data
    const sendingData = {
      ...data,
      ispOwner: reseller.ispOwner,
      ispId: reseller.ispOwner,
      resellerId: reseller.id,
      subAreas: areaSubareas
        ?.filter((val) => val.isChecked)
        .map((val) => val.id),
      mikrotikPackages: resellerPackage
        ?.filter((val) => val.isChecked)
        .map((val) => val.id),
      permission: permissionData,
      commissionType,
      commissionRate: {
        reseller: Number(resellerCommission),
        isp: Number(ispCommission),
      },
      customerType: reseller?.customerType,
    };

    if (data.status === "inactive") {
      const customerInActiveConfirm = window.confirm(
        t("areYouWantToInactiveResellerCustomer")
      );

      if (customerInActiveConfirm) {
        sendingData.customerInactive = true;
      }
    }

    // mikrotik package id validation
    if (sendingData?.mikrotikPackages.length === 0) {
      toast.error("Please select a package");
      return;
    }

    // reseller mikrotik id
    if (bpSettings.hasMikrotik) {
      sendingData.mikrotiks = resellerMikrotik
        .filter((val) => val.isChecked)
        .map((val) => val.id);
    }

    if (commissionType === "packageBased") {
      sendingData.commissionStyle = packageBasedType;
      sendingData.resellerPackageRates = packageCommission;

      // package commission validation
      let errorFlag = false,
        msg;
      resellerPackage.map((pack) => {
        if (pack.isChecked) {
          let commission = packageCommission.find(
            (rateItem) => rateItem.mikrotikPackage === pack.id
          );

          if (!commission) {
            errorFlag = true;
            msg = t("packageRateError");
          } else {
            let foundPackage = resellerPackage.find(
              (pack) => pack.id === commission.mikrotikPackage
            );
            console.log(foundPackage.rate, commission);
            if (foundPackage.rate < Number(commission.ispOwnerRate)) {
              errorFlag = true;
              msg = t("packageRateIncorret");
            }
          }
        }
      });
      if (errorFlag) return toast.error(msg);
    }

    // reseller update api
    editReseller(dispatch, sendingData, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="xl"
        header={reseller?.name}
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
              className="btn btn-success"
              form="resellerEdit"
              disabled={ispOwnerId === "624f41a4291af1f48c7d75c7"}
            >
              {isLoading ? <Loader /> : t("save")}
            </button>
          </div>
        }
      >
        <Formik
          initialValues={{
            name: reseller?.name,
            mobile: reseller?.mobile,
            nid: reseller?.nid,
            address: reseller?.address,
            email: reseller?.email,
            website: reseller?.website,
            status: reseller?.status,
          }}
          validationSchema={resellerValidator}
          onSubmit={(values) => {
            resellerProfileHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="resellerEdit">
              <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                {/* reseller profile tab start */}
                <Tab eventKey="profile" title={t("profile")}>
                  <div className="d-flex justify-content-center">
                    <div className="displayGrid col-6">
                      {dataInputOption?.inputOption.map(
                        (item) => item?.isVisible && <FtextField {...item} />
                      )}
                    </div>
                  </div>
                </Tab>
                {/* reseller profile tab end */}

                {/* reseller area tab start */}
                <Tab eventKey="area" title={t("area")}>
                  <ResellerArea
                    reseller={reseller}
                    useState={{ areaSubareas, setAreaSubareas }}
                  />
                </Tab>
                {/* reseller area tab end */}

                {/* reseller package tab start */}
                <Tab eventKey="package" title={t("package")}>
                  <ResellerPackage
                    reseller={reseller}
                    useState={{
                      ispCommission,
                      commissionType,
                      resellerPackage,
                      packageBasedType,
                      resellerMikrotik,
                      packageCommission,
                      resellerCommission,
                      setIspCommission,
                      setCommissionType,
                      setResellerPackage,
                      setPackageBasedType,
                      setResellerMikrotik,
                      setPackageCommission,
                      setResellerCommission,
                    }}
                  />
                </Tab>
                {/* reseller package tab end */}

                {/* reseller permissions tab start */}
                <Tab eventKey="permission" title={t("permissions")}>
                  <ResellerPermission
                    useState={{
                      permissions,
                      setPermissions,
                    }}
                  />
                </Tab>
                {/* reseller permissions tab end */}
              </Tabs>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default ResellerEdit;
