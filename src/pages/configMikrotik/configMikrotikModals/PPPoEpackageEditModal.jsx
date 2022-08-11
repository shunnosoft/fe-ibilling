import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editPPPoEpackageRate } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
// import {
//   editPPPoEpackageRate,
//   fetchpppoePackage,
// } from "../../../features/mikrotikSlice";

export default function PPPoEpackageEditModal({ singlePackage }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const pppoePackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  const data = pppoePackage.find((item) => item.id === singlePackage);

  const [isLoading, setIsLoading] = useState(false);
  const [radioChecked, setRadioChecked] = useState(false);
  const reseller = useSelector((state) => state?.reseller?.reseller);

  //validator
  const pppoeValidator = Yup.object({
    rate: Yup.number(),
    // persentage: Yup.number("Input must be a number").max(
    //   100,
    //   "Persentage must be 0-100"
    // ),
  });

  const pppoeEditHandler = async (formValue, resetForm) => {
    if (formValue) {
      // const IDs = {
      //   ispOwner: singlePackage.ispOwner,
      //   mikrotikId: singlePackage.mikrotik,
      // };
      const sendingData = {
        rate: formValue.rate.toString(),
        mikrotikId: data?.mikrotik,
        pppPackageId: data?.id,
      };
      if (formValue.persentage) {
        sendingData.persentage.ispOwner = formValue.persentage;
      }
      editPPPoEpackageRate(dispatch, sendingData, setIsLoading, resetForm);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="pppoePackageEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data?.name} - {t("rateEdit")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{
                  rate: data?.rate || "",
                  // persentage: data?.persentage || 0,
                }}
                validationSchema={pppoeValidator}
                onSubmit={(values, { resetForm }) => {
                  pppoeEditHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <FtextField
                      min={0}
                      type="number"
                      label={t("packageRate")}
                      name="rate"
                    />

                    {/* <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexRadioDefault2"
                        value={radioChecked}
                        onChange={(e) => setRadioChecked(e.target.checked)}
                      />
                      <label
                        className="form-check-label changeLabelFontColor"
                        htmlFor="flexRadioDefault2"
                      >
                        Divide Package for Reseller commision
                      </label>
                    </div>

                    {radioChecked && (
                      <>
                        <label
                          htmlFor="selectReseller"
                          className="form-input-label changeLabelFontColor"
                        >
                          {t("selectReseller")}
                        </label>
                        <select
                          id="selectReseller"
                          className="form-select mw-100 mb-2"
                        >
                          {reseller.map((item) => (
                            <option key={reseller.id} value={reseller.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <FtextField
                          min={0}
                          type="number"
                          label={t("persentage")}
                          name="persentage"
                        /> 
                      </>
                    )}*/}

                    {/* <FtextField
                      min={0}
                      type="number"
                      label={t("editRate")}
                      name="rate"
                    /> */}

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success customBtn"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : t("save")}
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
