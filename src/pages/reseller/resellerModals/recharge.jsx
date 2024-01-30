import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

// internal import
import "../../message/message.css";
import Loader from "../../../components/common/Loader";
import { recharge } from "../../../features/apiCalls";
import { FtextField } from "../../../components/common/FtextField";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const Recharge = ({ show, setShow, resellerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId } = useISPowner();

  // get all reseller data from redux store
  const allReseller = useSelector((state) => state?.reseller?.reseller);

  // single reseller find by id
  const reseller = allReseller.find((val) => {
    return val.id === resellerId;
  });

  // loading state
  const [isLoading, setIsloading] = useState(false);

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
    recharge(data, setIsloading, dispatch, setShow);
  };
  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("rechargeAmount")}
      >
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
          {() => (
            <Form>
              <div className="displayGrid">
                <FtextField
                  type="number"
                  label={t("enterAmount")}
                  name="amount"
                  min={0}
                />

                <div>
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
              </div>

              <div className="displayGrid1 float-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
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
      </ComponentCustomModal>
    </>
  );
};

export default Recharge;
