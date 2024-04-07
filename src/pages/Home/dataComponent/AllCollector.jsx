import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

// internal import
import Table from "../../../components/table/Table";
import CollectionOverviewPdf from "../homePdf/CollectionOverviewPdf";
import { getIspOwnerCollector } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import SummaryCalculation from "./SummaryCalculation";

const AllCollector = ({
  modalShow,
  setModalShow,
  ispOwnerId,
  month,
  year,
  status,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get customerStat
  const collectorData = useSelector(
    (state) => state.dashboardInformation?.ispOwnerCollector
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    status === "collector" &&
      getIspOwnerCollector(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [status, year, month]);

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
        width: "10%",
        Header: t("collection"),
        Cell: ({ row: { original } }) => (
          <div>
            {original?.totalBillCollected}&nbsp;
            <span className="text-primary">
              ({original?.totalBillCollectionByCollectorCount})
            </span>
          </div>
        ),
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
        <div className="table-section">
          <Table
            isLoading={isLoading}
            columns={column}
            data={collectorData}
            customComponent={SummaryCalculation(collectorData)}
          ></Table>
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
