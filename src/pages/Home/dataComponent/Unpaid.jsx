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
import { getUnpaidCustomer } from "../../../features/apiCalls";
import CustomerPdf from "../homePdf/CustomerPdf";

const Unpaid = ({ ispOwnerId, month, year }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get unpaid customer data
  const customer = useSelector(
    (state) => state.dashboardInformation?.unpaidCustomer
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  const column = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "9%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "9%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
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
        width: "9%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "8%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "11%",
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
    getUnpaidCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [month]);

  // all monthlyFee count
  const allBill = useCallback(() => {
    let count = 0;
    customer.forEach((item) => {
      count = count + item.monthlyFee;
    });
    return FormatNumber(count);
  }, [customer]);

  // custom component monthlyFee tk show
  const customComponent = (
    <div style={{ fontSize: "18px" }}>
      {t("totalBill")} {allBill()} {t("tk")}
    </div>
  );

  return (
    <div
      className="modal fade"
      id="unPaid"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("unpaidCustomer")}
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
                    customComponent={customComponent}
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

export default Unpaid;
