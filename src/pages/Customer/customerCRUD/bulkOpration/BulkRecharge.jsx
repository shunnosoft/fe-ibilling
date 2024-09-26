import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulkCustomerRecharge } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import { FtextField } from "../../../../components/common/FtextField";
import useDataInputOption from "../../../../hooks/useDataInputOption";
import useISPowner from "../../../../hooks/useISPOwner";

const BulkRecharge = ({ bulkCustomer, show, setShow, page }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // call the data input option function
  const inputPermission = {
    mikrotik: true,
    mikrotikPackage: true,
    monthlyFee: true,
  };

  // get user & current user data form useISPOwner hook
  const { hasMikrotik, userData, currentUser } = useISPowner();

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(inputPermission, page, null, null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Bulk customer recharge form handler function
  const customerBulkRechargeHandler = (formValue) => {
    const { mikrotik, mikrotikPackage, monthlyFee, medium } = formValue;
    const otherCounts = { mikrotik: 0, package: 0 };

    const filterCustomers = (customer) => {
      if (hasMikrotik) {
        if (customer.original.mikrotik !== mikrotik) {
          otherCounts.mikrotik++;
          toast.error(`মাইক্রটিক এর মধ্যে এই ${customer.original.name} নেই`);
          return false;
        }
      } else {
        if (
          customer.original.mikrotikPackage !== mikrotikPackage ||
          customer.original.status === "expired"
        ) {
          otherCounts.package++;
          toast.error(`প্যাকেজ এর মধ্যে এই ${customer.original.name} নেই`);
          return false;
        }
      }
      return true;
    };

    const customers = bulkCustomer.filter(filterCustomers);

    const data = {
      customerIds: customers.map((item) => item.original.id),
      mikrotik,
      mikrotikPackage,
      amount: monthlyFee,
      billType: "bill",
      medium,
      name: userData.name,
      collectedBy: currentUser?.user.role,
      user: currentUser?.user.id,
      collectorId: userData?.id,
    };

    const changeCustomer = customers.length;
    const confirmMessage = `
      ${t("areYouWantToUpdateStatus")} ${changeCustomer} ${t(
      "updateCustomerPackage"
    )}
      ${otherCounts.mikrotik} ${t("otherMtkUsers")}
      ${otherCounts.package} ${t("otherPackageUsers")}
    `;

    if (window.confirm(confirmMessage)) {
      bulkCustomerRecharge(dispatch, data, setIsLoading, setShow);
    }
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("bulkRecharge")}>
      <Formik
        initialValues={{
          ...dataInputOption?.inputInitialValues,
          medium: "cash",
        }}
        validationSchema={dataInputOption?.validationSchema}
        onSubmit={(values) => {
          customerBulkRechargeHandler(values);
        }}
        enableReinitialize
      >
        {() => (
          <Form id="packageRecharge">
            <div className="displayGrid">
              {dataInputOption?.inputOption.map(
                (item) =>
                  item?.isVisible && <FtextField key={item.name} {...item} />
              )}

              <div>
                <label className="form-control-label changeLabelFontColor">
                  {t("medium")} <span className="text-danger">*</span>
                </label>
                <Field
                  as="select"
                  name="medium"
                  className="form-select mt-0 mw-100"
                >
                  <option value="cash">{t("handCash")}</option>
                  <option value="bKash">{t("bKash")}</option>
                  <option value="rocket">{t("rocket")}</option>
                  <option value="nagad">{t("nagad")}</option>
                  <option value="others">{t("others")}</option>
                </Field>
              </div>
            </div>
          </Form>
        )}
      </Formik>

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
          className="btn btn-success"
          form="packageRecharge"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : t("recharge")}
        </button>
      </div>
    </RootBulkModal>
  );
};

export default BulkRecharge;
