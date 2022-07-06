import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { Card } from "react-bootstrap";
import { addStaff } from "../../../features/apiCallStaff";
import { useTranslation } from "react-i18next";

export default function StaffPost() {
  const { t } = useTranslation();
  // const [Check, setCheck] = useState(RBD);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //validator
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
  });

  const staffHandler = (data, resetForm) => {
    const sendingData = {
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      fatherName: data.fatherName,
      address: data.address,
      nid: data.nid,
      reference: {
        name: data.refName,
        mobile: data.refMobile,
        email: data.refEmail,
        address: data.refAddress,
        relation: data.refRelation,
        nid: data.refNid,
      },
      ispOwner,
      user: auth.user.id,
    };
    addStaff(dispatch, sendingData, setIsLoading);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="staffModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewStaff")}
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
                  name: "",
                  mobile: "",
                  email: "",
                  fatherName: "",
                  nid: "",
                  address: "",
                  refName: "",
                  refMobile: "",
                  refEmail: "",
                  refAddress: "",
                  refRelation: "",
                  refNid: "",
                }}
                validationSchema={resellerValidator}
                onSubmit={(values, { resetForm }) => {
                  staffHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    {/* first part */}

                    <div className="displayGrid3">
                      <FtextField type="text" label={t("name")} name="name" />
                      <FtextField
                        type="text"
                        label={t("mobile")}
                        name="mobile"
                      />
                      <FtextField type="text" label={t("email")} name="email" />
                    </div>

                    <div className="displayGrid3">
                      <FtextField
                        type="text"
                        label={t("parentName")}
                        name="fatherName"
                      />
                      <FtextField type="text" label={t("NIDno")} name="nid" />
                      <FtextField
                        type="text"
                        label={t("address")}
                        name="address"
                      />
                    </div>

                    <Card>
                      <Card.Body>
                        <Card.Title> {t("referenceInformation")} </Card.Title>
                        <Card.Text>
                          <div className="displayGrid3">
                            <FtextField
                              type="text"
                              label={t("referenceName")}
                              name="refName"
                            />
                            <FtextField
                              type="text"
                              label={t("referenceMobile")}
                              name="refMobile"
                            />
                            <FtextField
                              type="text"
                              label={t("referenceEmail")}
                              name="refEmail"
                            />
                          </div>

                          <div className="displayGrid3">
                            <FtextField
                              type="text"
                              label={t("referenceNID")}
                              name="refNid"
                            />
                            <FtextField
                              type="text"
                              label={t("referenceAddress")}
                              name="refAddress"
                            />
                            <FtextField
                              type="text"
                              label={t("referenceRelation")}
                              name="refRelation"
                            />
                          </div>
                        </Card.Text>
                      </Card.Body>
                    </Card>

                    <div className="modal-footer modalFooterEdit">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : t("save")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {t("cancle")}
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
