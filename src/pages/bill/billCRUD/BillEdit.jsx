import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
// import { editCustomer } from "../../../features/customerSlice";
// import { fetchCustomer } from "../../../features/customerSlice";
import Loader from "../../../components/common/Loader";
import { editCustomer } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function CustomerEdit({ single }) {
  const { t } = useTranslation();
  const CUSTOMER = single;
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  // const CUSTOMER = useSelector(state => state.customer.singleCustomer);
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  // customer validator
  const customerEditValidator = Yup.object({
    name: Yup.string(),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    balance: Yup.string(),
    monthlyFee: Yup.string(),
  });
  // const customerEditValidator = Yup.object({
  //   name: Yup.string().required("নাম দিন"),
  //   mobile: Yup.string()
  //     .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
  //     .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
  //     .required("মোবাইল নম্বর দিন "),
  //   address: Yup.string().required("নাম দিন"),
  //   email: Yup.string()
  //     .email("ইমেইল সঠিক নয় ")
  //     .required("ম্যানেজার এর ইমেইল দিতে হবে"),
  //   nid: Yup.string().required("NID দিন"),
  //   status: Yup.string().required("Choose one"),
  //   balance: Yup.string().required("Balance দিন"),
  //   monthlyFee: Yup.string().required("Montly Fee দিন"),
  // });

  const customerEditHandler = async (data) => {
    // console.log(data);
    setIsloading(true);

    const mainData = {
      // customerId: "randon123",
      customerId: single.customerId,
      singleCustomerID: single.id,
      // ispID: ispOwner.id,
      ispOwner: ispOwnerId,
      ...data,
    };
    editCustomer(dispatch, mainData, setIsloading);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {`${CUSTOMER.name}`} {t("informationEdit")}
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
                  name: CUSTOMER.name || "",
                  address: CUSTOMER.address || "",
                  email: CUSTOMER.email || "",
                  nid: CUSTOMER.nid || "",
                  balance: CUSTOMER.balance || "",
                  monthlyFee: CUSTOMER.monthlyFee || "",
                  billPayType: CUSTOMER.billPayType || "",
                }}
                validationSchema={customerEditValidator}
                onSubmit={(values) => {
                  customerEditHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <FtextField type="text" label={t("name")} name="name" />
                    <FtextField
                      type="text"
                      label={t("address")}
                      name="address"
                    />
                    <FtextField type="text" label={t("email")} name="email" />
                    <FtextField type="text" label={t("NIDno")} name="nid" />

                    <div className="form-check customerFormCheck">
                      <p>{t("billPaymentType")}</p>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Prepaid"
                          className="form-check-input"
                          type="radio"
                          name="billPayType"
                          id="billPayType1"
                          value="prepaid"
                        />
                      </div>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Postpaid"
                          className="form-check-input"
                          type="radio"
                          name="billPayType"
                          id="billPayType2"
                          value="postpaid"
                        />
                      </div>
                    </div>
                    <FtextField
                      type="text"
                      label={t("balance")}
                      name="balance"
                    />
                    <FtextField
                      type="text"
                      label={t("monthFee")}
                      name="monthlyFee"
                    />
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        {t("cancel")}
                      </button>
                      <button type="submit" className="btn btn-success">
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
