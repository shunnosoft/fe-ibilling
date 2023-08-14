import React, { useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { FtextField } from "../../components/common/FtextField";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  getOnlineBalance,
  getPaymentWithdrawReport,
  postOnlinePayment,
} from "../../features/apiCallReseller";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";
import moment from "moment";
import { badge } from "../../components/common/Utils";
import { toast } from "react-toastify";

const WithdrawOnlinePayment = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  // for validation -- reseller
  const paymentWithdraw = Yup.object({
    amount: Yup.number()
      .min(250, t("amountMustBeAbove"))
      .integer(t("decimalNumberNotAcceptable"))
      .required(t("amountFieldIsRequired")),
  });

  // get user information
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth.userData?.id
  );

  // get reseller withdraw balance report
  const withdrawReport = useSelector((state) => state.payment?.withdrawBalance);

  // customer online balance state
  const [onlineBalance, setOnlineBalance] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isPost, setIsPost] = useState(false);

  useEffect(() => {
    onlineBalance.length === 0 &&
      getOnlineBalance(resellerId, year, month, setOnlineBalance);
    withdrawReport.length === 0 &&
      getPaymentWithdrawReport(dispatch, resellerId, year, month, setIsLoading);
  }, []);

  //modal close handle
  const handleClose = () => setShow(false);

  // withdraw online payment handle
  const withdrawPaymentAmount = (values) => {
    const { amount, ...res } = values;

    if (onlineBalance.amount < amount) {
      toast.warn(t("notEnoughOnlineBalance"));
    }

    const sendData = {
      reseller: resellerId,
      amount: amount,
      balance: onlineBalance.amount - amount,
      ...res,
    };

    postOnlinePayment(dispatch, sendData, setIsPost);
  };

  const resellerWithdrawReport = useMemo(() => {
    let initialValue = 0;

    withdrawReport.map((val) => {
      if (val.status === "accepted") {
        return (initialValue += val.amount);
      }
    });

    return { initialValue };
  }, [withdrawReport]);

  // sending table header data
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {resellerWithdrawReport?.initialValue > 0 && (
        <div>
          {t("totalWithdraw")}:- ৳
          {FormatNumber(resellerWithdrawReport.initialValue)}
        </div>
      )}
    </div>
  );

  const columns = useMemo(
    () => [
      {
        width: "25%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "25%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "25%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
    ],
    [t]
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <ModalHeader closeButton>
        <ModalTitle>
          <h5 className="modal-title">{t("onlinePaymentWithdraw")}</h5>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="collectorWrapper mt-2 py-2">
          <div className="managerDipositToIsp">
            <Formik
              initialValues={{
                //put the value from api
                amount: onlineBalance.amount,
                status: "pending",
              }}
              validationSchema={paymentWithdraw}
              onSubmit={(values) => {
                withdrawPaymentAmount(values);
              }}
              enableReinitialize
            >
              {() => (
                <Form>
                  <h5 className="text-center text-secondary mb-0">
                    {t("onlinePaymentAmount")} : ৳{" "}
                    {FormatNumber(onlineBalance.amount)}
                  </h5>

                  <div className="displayGridForDiposit d-flex justify-content-center">
                    <FtextField
                      type="text"
                      name="amount"
                      label={t("withdrawAmount")}
                    />
                    <button
                      type="submit"
                      className="btn btn-outline-primary w-140 dipositSubmitBtn"
                    >
                      {isPost ? <Loader /> : t("submit")}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="tableSection">
            <Table
              isLoading={isLoading}
              customComponent={customComponent}
              data={withdrawReport}
              columns={columns}
            ></Table>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default WithdrawOnlinePayment;
