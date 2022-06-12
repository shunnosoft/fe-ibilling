import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editPPPoEpackageRate } from "../../../features/apiCalls";
// import {
//   editPPPoEpackageRate,
//   fetchpppoePackage,
// } from "../../../features/mikrotikSlice";

export default function PPPoEpackageEditModal({ singlePackage }) {
  const pppoePackage = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoePackage
  );

  const data = pppoePackage.find((item) => item.id === singlePackage);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //validator
  const pppoeValidator = Yup.object({
    rate: Yup.number(),
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
                {data?.name} - রেট এডিট করুন
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
                      label="রেট এডিট করুন"
                      name="rate"
                    />

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success customBtn"
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
