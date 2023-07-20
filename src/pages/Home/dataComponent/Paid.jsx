import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import Table from "../../../components/table/Table";
import { getPaidCustomer } from "../../../features/apiCalls";
import CustomerPdf from "../homePdf/CustomerPdf";

const Paid = ({ ispOwnerId, month, year, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get user permission
  const permissions = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get paid customer data
  const customer = useSelector(
    (state) => state.dashboardInformation?.paidCustomer
  );

  //is Loading state
  const [isLoading, setIsLoading] = useState(false);

  const column = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "8%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "8%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
      },
      {
        width: "8%",
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "8%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "8%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "8%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "10%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    [t]
  );

  useEffect(() => {
    status === "paid" &&
      getPaidCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [month, status, year]);

  // all monthlyFee count
  const allBill = useMemo(() => {
    let count = 0;
    let balanceSum = 0;
    customer.forEach((item) => {
      count = count + item.monthlyFee;
      balanceSum += item.balance;
    });
    return { count, balanceSum };
  }, [customer]);

  // custom component monthlyFee tk show
  const customComponent = (
    <div style={{ fontSize: "18px" }}>
      {t("totalBill")} {FormatNumber(allBill.count)} {t("tk")} &nbsp;&nbsp;
      {t("totalBalance")}: {FormatNumber(allBill.balanceSum)} {t("tk")}
    </div>
  );

  return (
    <div
      className="modal fade"
      id="paid"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("paidCustomer")}
            </h5>

            <div className="collectorWrapper pt-0">
              <div
                className="addAndSettingIcon"
                style={{
                  marginLeft: ".5rem",
                  textAlign: "end",
                }}
              >
                <ReactToPrint
                  documentTitle="Customer Overview"
                  trigger={() => (
                    <PrinterFill
                      // title={t("print")}
                      className="addcutmButton"
                      style={{ background: "#0EB96A", color: "white" }}
                    />
                  )}
                  content={() => componentRef.current}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {customer && (
              <>
                <div className="table-section">
                  <Table
                    isLoading={isLoading}
                    customComponent={
                      role === "ispOwner" ||
                      permissions?.dashboardCollectionData
                        ? customComponent
                        : ""
                    }
                    columns={column}
                    data={customer}
                  ></Table>
                </div>

                <div className="d-none">
                  <CustomerPdf customerData={customer} ref={componentRef} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paid;
