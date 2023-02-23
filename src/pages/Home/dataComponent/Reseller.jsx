import React, { useEffect, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import Table from "../../../components/table/Table";
import ResellerCollectionPdf from "../homePdf/ResellerCollectionPdf";

const Reseller = () => {
  const { t } = useTranslation();
  const componentRef = useRef();

  // get reseller data
  const customerStat = useSelector((state) => state.chart.customerStat);

  // ispOwner role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // reseller data state
  const [resellerData, setResellerData] = useState([]);

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

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
      },
      {
        width: "23%",
        Header: t("billCollected"),
        accessor: "totalBillCollected",
      },
      {
        width: "23%",
        Header: t("billDue"),
        accessor: "totalDueAmount",
      },
    ],
    [t]
  );

  useEffect(() => {
    if (customerStat) {
      setResellerData(customerStat?.resellerStat);
    }
  }, [customerStat]);

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
                  // paddingTop: "1rem",
                  // paddingBottom: "1rem",
                  // background: "green",
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
            {role === "ispOwner" && resellerData && resellerData.length > 0 && (
              <>
                <div className="table-section">
                  <Table
                    isLoading={isLoading}
                    columns={column}
                    data={resellerData}
                  ></Table>
                </div>
                <div className="d-none">
                  <ResellerCollectionPdf
                    resellerCollectionData={customerStat}
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

export default Reseller;
