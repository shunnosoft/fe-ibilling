import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import Table from "../../../components/table/Table";
import ResellerCollectionPdf from "../homePdf/ResellerCollectionPdf";
import { getIspOwnerReseller } from "../../../features/apiCalls";
import FormatNumber from "../../../components/common/NumberFormat";
import { useCallback } from "react";

const Reseller = ({ ispOwnerId, month, year, status }) => {
  const { t } = useTranslation();
  const componentRef = useRef();
  const dispatch = useDispatch();

  // get active customer data
  const resellerData = useSelector(
    (state) => state.dashboardInformation?.ispOwnerReseller
  );

  //get dashboard different cards data
  const customerStat = useSelector((state) => state.chart.customerStat);

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    status === "reseller" &&
      getIspOwnerReseller(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [status, year, month]);

  const column = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "23%",
        Header: t("balance"),
        accessor: "currentBalance",
        Cell: ({ cell: { value } }) => {
          return Math.floor(value);
        },
      },
      {
        width: "23%",
        Header: t("billCollected"),
        Cell: ({ row: { original } }) => (
          <div>
            {original?.totalBillCollected}&nbsp;
            <span className="text-primary">({original?.billCount})</span>
          </div>
        ),
      },
      {
        width: "23%",
        Header: t("billDue"),
        Cell: ({ row: { original } }) => (
          <div>
            {original?.totalDueAmount}&nbsp;
            <span className="text-primary">({original?.totalDueCount})</span>
          </div>
        ),
      },
    ],
    [t]
  );

  //summary Calculation function
  const summaryCalculation = useMemo(() => {
    const initialValue = {
      totalBalance: 0,
      totalCollection: 0,
    };

    const calculatedValue = resellerData.reduce((previous, current) => {
      // sum of all balance
      previous.totalBalance += Math.floor(current.currentBalance);

      // sum of all bill collection
      previous.totalCollection += current.totalBillCollected;

      return previous;
    }, initialValue);
    return calculatedValue;
  }, [resellerData]);

  //custom table header component
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {summaryCalculation?.totalBalance > 0 && (
        <div>
          {t("totalBalance")}:-৳
          {FormatNumber(summaryCalculation?.totalBalance)}
        </div>
      )}
      &nbsp;&nbsp;
      {summaryCalculation?.totalCollection > 0 && (
        <div>
          {t("totalCollection")}:-৳
          {FormatNumber(summaryCalculation?.totalCollection)}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="modal fade"
      id="resellerInformationModal"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("reseller")}
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
                  documentTitle="Collection Overview"
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
            <div className="table-section">
              <Table
                isLoading={isLoading}
                columns={column}
                data={resellerData}
                customComponent={customComponent}
              ></Table>
            </div>
            <div className="d-none">
              <ResellerCollectionPdf
                resellerCollectionData={resellerData}
                ref={componentRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reseller;
