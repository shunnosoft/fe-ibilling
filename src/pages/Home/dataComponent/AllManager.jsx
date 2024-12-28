import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import { PrinterFill } from "react-bootstrap-icons";

// internal import
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import Table from "../../../components/table/Table";
import CollectionOverviewPdf from "../homePdf/CollectionOverviewPdf";
import SummaryCalculation from "./SummaryCalculation";
import { getIspOwnerManager } from "../../../features/apiCalls";

const AllManager = ({
  status,
  modalShow,
  setModalShow,
  ispOwnerId,
  year,
  month,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get manager data
  const managerData = useSelector(
    (state) => state.dashboardInformation?.ispOwnerManager
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    status === "manager" &&
      // get all manager api
      getIspOwnerManager(dispatch, ispOwnerId, year, month, setIsLoading);
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
        width: "10%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "12%",
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
            <span className="text-success">{original?.totalBillCollected}</span>
            &nbsp;
            <span className="text-primary">
              ({original?.totalBillCollectionByManagerCount})
            </span>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("connectionFee"),
        accessor: "totalConnectionFeeCollected",
        Cell: ({ row: { original } }) => (
          <span className="text-success">
            {original?.totalConnectionFeeCollected}
          </span>
        ),
      },
      {
        width: "12%",
        Header: t("depositCollection"),
        Cell: ({ row: { original } }) => (
          <span className="text-success">{original?.depositCollection}</span>
        ),
      },
      {
        width: "10%",
        Header: t("totalDepositCollector"),
        Cell: ({ row: { original } }) => (
          <span className="text-danger">{original?.totalDeposit}</span>
        ),
      },
      {
        width: "10%",
        Header: t("expense"),
        Cell: ({ row: { original } }) => (
          <span className="text-danger">{original?.expenditure}</span>
        ),
      },
      {
        width: "11%",
        Header: t("previousBalance"),
        accessor: "prevMonth.balance",
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
    <ComponentCustomModal
      show={modalShow}
      setShow={setModalShow}
      centered={false}
      size="xl"
      header={t("allManager")}
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
          data={managerData}
          customComponent={SummaryCalculation(managerData)}
        />
      </div>

      <div className="d-none">
        <CollectionOverviewPdf
          allCollectionData={managerData}
          ref={componentRef}
        />
      </div>
    </ComponentCustomModal>
  );
};

export default AllManager;
