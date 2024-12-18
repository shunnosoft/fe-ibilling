import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";

//internal import
import Loader from "../../../../components/common/Loader";
import { bulkPackageEdit } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import useDataInputOption from "../../../../hooks/useDataInputOption";
import { FtextField } from "../../../../components/common/FtextField";
import useISPowner from "../../../../hooks/useISPOwner";

const BulkPackageEdit = ({ bulkCustomer, show, setShow, page }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get user & current user data form useISPOwner hook
  const { hasMikrotik } = useISPowner();

  // call the data input option function
  const inputPermission = {
    mikrotik: true,
    mikrotikPackage: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(inputPermission, page, null, null);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // change package submit hadler
  const changePackage = (data) => {
    let otherCusetomerCount = 0;
    let customers;
    if (data) {
      customers = bulkCustomer.reduce((acc, current) => {
        if (hasMikrotik) {
          if (current.original.mikrotik === data.mikrotik) {
            acc.push(current);
          } else {
            otherCusetomerCount++;
            toast.error(
              "মাইক্রটিক এর মধ্যে এই " + current.original.name + " নেই"
            );
          }
        } else {
          acc.push(current);
        }

        return acc;
      }, []);
    } else {
      alert(t("selectMikrotik"));
    }

    if (data) {
      const sendingData = {
        customerIds: customers.map((item) => item.original.id),
        mikrotikPackage: data.mikrotikPackage,
      };

      const confirm = window.confirm(
        t("areYouWantToUpdateStatus") +
          customers.length +
          t("updateCustomerPackage") +
          "\n" +
          otherCusetomerCount +
          t(" otherMtkUsers")
      );

      if (confirm) {
        bulkPackageEdit(dispatch, sendingData, setIsLoading, setShow);
      }
    } else {
      alert(t("selectPackage"));
    }
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("updatePackage")}>
      <Formik
        initialValues={{
          ...dataInputOption?.inputInitialValues,
        }}
        validationSchema={dataInputOption?.validationSchema}
        onSubmit={(values) => {
          changePackage(values);
        }}
        enableReinitialize
      >
        {() => (
          <Form id="packageUpdate">
            <div className="displayGrid">
              {dataInputOption?.inputOption.map(
                (item) => item?.isVisible && <FtextField {...item} />
              )}
            </div>
          </Form>
        )}
      </Formik>

      <div className="displayGrid1 float-end mt-4">
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
          form="packageUpdate"
          className="btn btn-success"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : t("submit")}
        </button>
      </div>
    </RootBulkModal>
  );
};

export default BulkPackageEdit;
