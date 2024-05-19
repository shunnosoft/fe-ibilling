import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

// internal import
import Table from "../../../components/table/Table";
import CollectionOverviewPdf from "../homePdf/CollectionOverviewPdf";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import SummaryCalculation from "./SummaryCalculation";
import { getIspOwnerCollector } from "../../../features/apiCalls";

const AllCollector = ({
  modalShow,
  setModalShow,
  ispOwnerId,
  month,
  year,
  status,
}) => {
  const { t } = useTranslation();
  const componentRef = useRef();
  const dispatch = useDispatch();

  // get customerStat
  const collectorData = useSelector(
    (state) => state.dashboardInformation?.ispOwnerCollector
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // get all collector data
  useEffect(() => {
    status === "collector" &&
      getIspOwnerCollector(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [status, year, month]);

  // table column
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
        width: "10%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "15%",
        Header: t("todayCollection"),

        Cell: ({ row: { original } }) => (
          <div>
            {original?.todayBillCollection}&nbsp;
            <span className="text-primary">
              ({original?.todayBillCollectionCount})
            </span>
          </div>
        ),
      },
      {
        width: "15%",
        Header: t("collection"),
        Cell: ({ row: { original } }) => (
          <div>
            <span className="text-success">{original?.totalBillCollected}</span>
            &nbsp;
            <span className="text-primary">
              ({original?.totalBillCollectionByCollectorCount})
            </span>
          </div>
        ),
      },
      {
        width: "15%",
        Header: t("connectionFee"),
        Cell: ({ row: { original } }) => (
          <div>
            <span className="text-success">
              {original?.totalConnectionFeeCollected}
            </span>
          </div>
        ),
      },
      {
        width: "15%",
        Header: t("totalDepositCollector"),
        Cell: ({ row: { original } }) => (
          <div>
            <span className="text-danger">{original?.totalDeposit}</span>
          </div>
        ),
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

  return (
    <>
      <ComponentCustomModal
        show={modalShow}
        setShow={setModalShow}
        centered={false}
        size={"xl"}
        header={t("allCollector")}
        printr={
          <ReactToPrint
            documentTitle="Collection Overview"
            trigger={() => (
              <PrinterFill
                className="addcutmButton"
                style={{ background: "#0EB96A", color: "white" }}
              />
            )}
            content={() => componentRef.current}
          />
        }
      >
        <div className="collectorWrapper">
          <Table
            isLoading={isLoading}
            columns={column}
            data={collectorData}
            customComponent={SummaryCalculation(collectorData)}
          />
        </div>

        <div className="d-none">
          <CollectionOverviewPdf
            allCollectionData={collectorData}
            ref={componentRef}
          />
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default AllCollector;
