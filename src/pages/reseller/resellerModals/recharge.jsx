import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { recharge } from "../../../features/apiCalls";
import * as Yup from "yup";

import "../../message/message.css";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { FtextField } from "../../../components/common/FtextField";

function Recharge({ resellerId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.userData.id
  );

  const allReseller = useSelector((state) => state?.reseller?.reseller);
  const reseller = allReseller.find((val) => {
    return val.id === resellerId;
  });

  //recharge Validate with yup
  const rechargeValidate = Yup.object({
    amount: Yup.number().required(t("enterAmount")),
    comment: Yup.string(),
  });

  //recharge Handler
  const rechargeHandler = (val) => {
    const data = {
      amount: val.amount,
      comment: val.comment,
      ispOwner: ispOwnerId,
      reseller: reseller.id,
    };
    recharge(data, setIsloading, dispatch);
  };
  return (
    <>
      <div
        className="modal fade"
        id="resellerRechargeModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("rechargeAmount")}
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
                  amount: "",
                  comment: "",
                }}
                validationSchema={rechargeValidate}
                onSubmit={(values) => {
                  rechargeHandler(values);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <div>
                      <FtextField
                        type="number"
                        label={t("enterAmount")}
                        name="amount"
                        min={0}
                      />
                      <label className="changeLabelFontColor" htmlFor="comment">
                        {t("addComment")}
                      </label>

                      <Field
                        className="form-control shadow-none"
                        style={{
                          height: "70px",
                          width: "100%",
                          padding: "10px",
                        }}
                        component="textarea"
                        name="comment"
                      />
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        {t("cancel")}
                      </button>

                      <button type="submit" className="btn btn-success">
                        {isLoading ? <Loader /> : t("recharge")}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recharge;
