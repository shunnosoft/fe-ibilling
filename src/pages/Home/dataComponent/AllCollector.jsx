import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import Table from "../../../components/table/Table";
import CollectionOverviewPdf from "../CollectionOverviewPdf";

const AllCollector = () => {
  const { t } = useTranslation();

  // useRef
  const componentRef = useRef();

  // ispOwner role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get customerStat
  const customerState = useSelector((state) => state.chart.customerStat);

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // collector data state
  const [collectorData, setCollectorData] = useState("");

  const column = useMemo(
    () => [
      {
        width: "15%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "21%",
        Header: t("todayBillCollection"),
        accessor: "todayBillCollection",
      },
      {
        width: "21%",
        Header: t("totalBillCollected"),
        accessor: "totalBillCollected",
      },
      {
        width: "21%",
        Header: t("totalDepositCollector"),
        accessor: "totalDeposit",
      },
      {
        width: "21%",
        Header: t("balance"),
        accessor: "balance",
      },
    ],
    [t]
  );

  useEffect(() => {
    if (customerState) {
      setCollectorData(customerState.collectorStat);
    }
  }, [customerState]);

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

            <div className="collectorWrapper pt-1 pb-2">
              <div
                className="addAndSettingIcon"
                style={{
                  marginLeft: ".5rem",
                  textAlign: "end",
                  paddingTop: "1rem",
                  // background: "green",
                }}
              >
                <ReactToPrint
                  documentTitle="Collection Overveiw"
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
            {role === "ispOwner" &&
              collectorData &&
              collectorData.length > 0 && (
                <>
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={column}
                      data={collectorData}
                    ></Table>
                  </div>
                  <div className="d-none">
                    <CollectionOverviewPdf
                      allCollectionData={customerState}
                      //customerStat
                      // currentCustomers={Customers}
                      ref={componentRef}
                    />
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCollector;
