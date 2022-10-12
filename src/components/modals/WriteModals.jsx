import { Form, Formik } from "formik";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { editManager } from "../../features/apiCalls";

// internal imports
import { FtextField } from "../common/FtextField";
import Loader from "../common/Loader";
import { useTranslation } from "react-i18next";

export default function WriteModals(props) {
  const { t } = useTranslation();
  const { manager } = props;
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );

  // mangager validator
  const managerValidate = Yup.object({
    name: Yup.string()
      .min(3, t("minimumContaining3letter"))
      .required(t("enterManagerName")),
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string().required(t("enterManagerAddress")),
    email: Yup.string()
      .email(t("incorrectEmail"))
      .required(t("enterManagerEmail")),
    image: Yup.string(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const editManagerHandler = (data) => {
    editManager(dispatch, { ...data, ispOwner }, setIsLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="writeModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="exampleModalLabel">
              {t("editManager")}
            </h4>
            <button
              type="button"
              className="btn-close"
              id="closeAddManagerBtn"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Formik
              initialValues={{
                name: manager.name || "",
                mobile: manager.mobile || "",
                address: manager.address || "",
                email: manager.email || "",
                // nid: manager.nid || "",
                // photo: ,
              }}
              validationSchema={managerValidate}
              onSubmit={(values) => {
                editManagerHandler(values);
              }}
              enableReinitialize
            >
              {(formik) => (
                <Form>
                  <FtextField type="text" label={t("name")} name="name" />
                  <FtextField type="text" label={t("mobile")} name="mobile" />
                  <FtextField type="text" label={t("address")} name="address" />
                  <FtextField type="email" label={t("email")} name="email" />
                  {/* <FtextField type="text" label="NID নম্বর" name="nid" /> */}
                  {/* <FtextField
                    type="file"
                    label="ম্যানেজার এর ছবি "
                    name="photo"
                  /> */}

                  {/* Button */}
                  <div className="submitSection">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary marginLeft"
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
  );
}
