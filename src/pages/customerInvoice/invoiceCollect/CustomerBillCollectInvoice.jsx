import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";
import { useDispatch } from "react-redux";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { billCollectInvoice } from "../../../features/apiCalls";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

export default function CustomerBillCollectInvoice({
  show,
  setShow,
  invoiceId,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // all customer invoice
  const allInvoice = useSelector((state) => state?.payment?.customerInvoice);

  const invoice = allInvoice.find((item) => item.id === invoiceId);

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get ispOwner info
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get userData
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get currentUser
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  // get currentUserId
  const currentUserId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  const [isLoading, setLoading] = useState(false);
  const [medium, setMedium] = useState("cash");
  const [billAmount, setBillAmount] = useState();
  const [balanceDue, setBalanceDue] = useState();
  const totalAmount = Number(billAmount) + Number(balanceDue);
  const maxDiscount = totalAmount;

  //Validation
  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(invoice?.amount, t("billNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
    due: Yup.number()
      .min(invoice?.due, t("dueNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
    discount: Yup.number()
      .min(invoice?.discount, t("discountNotAcceptable"))
      .max(maxDiscount, t("discountNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
  });

  //form resetFunction
  const resetForm = () => {
    setBillAmount(invoice?.amount);
  };

  useEffect(() => {
    setBalanceDue(invoice?.due);
    setBillAmount(invoice?.amount);
  }, [invoice]);

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  const handleFormValue = (event) => {
    if (event.target.name === "amount") {
      setBillAmount(event.target.value);
    }
    if (event.target.name === "due") {
      setBalanceDue(event.target.value);
    }
  };

  // bill amount
  const invoiceSubmitHandler = (formValue) => {
    const sendingData = {
      amount: formValue.amount + formValue.due,
      discount: formValue.discount,
      name: userData.name,
      collectedBy: currentUser?.user.role,
      billType: "bill",
      customer: invoice?.customer?.id,
      ispOwner: ispOwner,
      user: currentUser?.user.id,
      collectorId: currentUserId,
      userType: invoice?.customer?.userType,
      medium,
      package: invoice?.customer?.pppoe.profile,
    };

    if (invoice?.note) sendingData.note = invoice?.note;

    if (invoice?.start && invoice?.end) {
      sendingData.start = invoice?.start;
      sendingData.end = invoice?.end;
    }
    if (invoice?.month) sendingData.month = invoice?.month;

    billCollectInvoice(
      dispatch,
      sendingData,
      setLoading,
      resetForm,
      invoiceId,
      setShow
    );
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {t("recharge")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              amount: invoice?.amount,
              due: invoice?.due,
              discount: invoice?.discount,
            }}
            validationSchema={BillValidatoin}
            onSubmit={(values) => {
              invoiceSubmitHandler(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form onChange={handleFormValue} id="rechargeInvoice">
                <table
                  className="table table-bordered"
                  style={{ lineHeight: "12px" }}
                >
                  <tbody>
                    <tr>
                      <td>{t("id")}</td>
                      <td>
                        <b>{invoice?.customer?.customerId}</b>
                      </td>
                      <td>{t("pppoe")}</td>
                      <td>
                        <b>{invoice?.customer?.pppoe?.name}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("name")}</td>
                      <td>
                        <b>{invoice?.customer?.name}</b>
                      </td>
                      <td>{t("mobile")}</td>
                      <td className="text-primary">
                        <b>{invoice?.customer?.mobile}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("monthly")}</td>
                      <td className="text-success">
                        <b>{invoice?.customer?.monthlyFee}</b>
                      </td>
                      <td>{t("balance")}</td>
                      <td className="text-info">
                        <b>{invoice?.customer.balance}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h6>
                  <span className="text-success">{t("totalBillAmount")}</span>
                  <span className="text-danger">{totalAmount} </span>
                </h6>

                <div className="bill_collect_form">
                  <div className="w-100 me-2">
                    <FtextField
                      type="number"
                      name="amount"
                      label={t("amount")}
                      value={billAmount}
                    />
                  </div>
                  <div className="w-100 me-2">
                    <FtextField type="number" name="due" label={t("due")} />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-inline w-100 mb-3 me-2">
                    <label
                      htmlFor="receiver_type"
                      className="form-control-label changeLabelFontColor"
                    >
                      {t("medium")}
                    </label>

                    <select
                      as="select"
                      id="receiver_type"
                      className="form-select mt-0 mw-100"
                      aria-label="Default select example"
                      onChange={(e) => setMedium(e.target.value)}
                      defaultValue={invoice?.medium}
                      key={invoice?.medium}
                    >
                      <option value="cash">{t("handCash")}</option>
                      <option value="bKash"> {t("bKash")} </option>
                      <option value="rocket"> {t("rocket")} </option>
                      <option value="nagad"> {t("nagad")} </option>
                      <option value="others"> {t("others")} </option>
                    </select>
                  </div>
                  <div className="w-100">
                    {(role === "ispOwner" || permission.billDiscount) && (
                      <FtextField
                        type="number"
                        name="discount"
                        label={t("discount")}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-1">
                  <button
                    type="submit"
                    form="rechargeInvoice"
                    className="btn btn-success"
                  >
                    {isLoading ? <Loader /> : t("submit")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
}
