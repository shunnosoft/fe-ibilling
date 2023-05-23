import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import Table from "../../../components/table/Table";
import CollectionOverviewPdf from "../homePdf/CollectionOverviewPdf";
import { getIspOwnerCollector } from "../../../features/apiCalls";

const AllCollector = ({ ispOwnerId, month, year, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // useRef
  const componentRef = useRef();

  // get customerStat
  const collectorData = useSelector(
    (state) => state.dashboardInformation?.ispOwnerCollector
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  const column = useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "19%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "14%",
        Header: t("todayCollection"),
        accessor: "todayBillCollection",
      },
      {
        width: "10%",
        Header: t("collection"),
        accessor: "totalBillCollected",
      },
      {
        width: "14%",
        Header: t("connectionFee"),
        accessor: "totalConnectionFeeCollected",
      },
      {
        width: "15%",
        Header: t("totalDepositCollector"),
        accessor: "totalDeposit",
      },
      {
        width: "15%",
        Header: t("previousBalance"),
        accessor: "prevMonthBalance",
      },
      {
        width: "10%",
        Header: t("balance"),
        accessor: "balance",
      },
    ],
    [t]
  );

  useEffect(() => {
    status === "collector" &&
      getIspOwnerCollector(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [status, year, month]);

  return (
    <div
      className="modal fade"
      id="allCollector"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("allCollector")}
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
                data={collectorData}
              ></Table>
            </div>
            <div className="d-none">
              <CollectionOverviewPdf
                allCollectionData={collectorData}
                ref={componentRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCollector;
