import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

// internal import
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import useDataInputOption from "../../hooks/useDataInputOption";
import { depositReportAmountUpdate } from "../../features/apiCalls";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";

const UpdateDeposit = ({ show, setShow, deposit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // call the data input option function
  const inputPermission = {
    amount: true,
    balance: true,
    note: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    null,
    null,
    deposit
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // deposit amount edit handler
  const depositReportAmountEditHandler = (data) => {
    const sendingData = {
      amount: Number(data.amount),
      balance: Number(data.balance),
      note: data.note,
    };

    // check amount and balance match or not
    if (sendingData.amount === sendingData.balance) {
      depositReportAmountUpdate(
        dispatch,
        deposit?.id,
        sendingData,
        setIsLoading,
        setShow
      );
    } else {
      setIsLoading(false);
      return toast.warn(t("amountAndBalanceNotMatch"));
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("editArea")}
      >
        <Formik
          initialValues={{
            ...dataInputOption?.inputInitialValues,
          }}
          validationSchema={dataInputOption?.validationSchema}
          onSubmit={(values) => {
            depositReportAmountEditHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="displayGrid">
                {dataInputOption?.inputOption.map(
                  (item) => item?.isVisible && <FtextField {...item} />
                )}
              </div>

              <div className="displayGrid1 float-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : t("save")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default UpdateDeposit;
