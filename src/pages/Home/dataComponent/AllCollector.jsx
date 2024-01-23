import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

// internal import
import Table from "../../../components/table/Table";
import CollectionOverviewPdf from "../homePdf/CollectionOverviewPdf";
import { getIspOwnerCollector } from "../../../features/apiCalls";
import FormatNumber from "../../../components/common/NumberFormat";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

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

  // useRef
  const componentRef = useRef();

  // get customerStat
  const collectorData = useSelector(
    (state) => state.dashboardInformation?.ispOwnerCollector
  );

  //get all roles
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // get user permission
  const permissions = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.manager?.permissions
  );

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

  useEffect(() => {
    status === "collector" &&
      getIspOwnerCollector(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [status, year, month]);

  //summary Calculation function
  const summaryCalculation = useMemo(() => {
    const initialValue = {
      totalTodayCollection: 0,
      totalCollection: 0,
    };

    const calculatedValue = collectorData.reduce((previous, current) => {
      // sum of today collection
      previous.totalTodayCollection += current.todayBillCollection;

      // sum of all bill collection
      previous.totalCollection += current.totalBillCollected;

      return previous;
    }, initialValue);

    return calculatedValue;
  }, [collectorData]);

  //custom table header component
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {summaryCalculation?.totalTodayCollection > 0 && (
        <div>
          {t("todayCollection")}:-৳
          {FormatNumber(summaryCalculation?.totalTodayCollection)}
        </div>
      )}
      &nbsp;&nbsp;
      {(role === "ispOwner" || permissions?.dashboardCollectionData) &&
        summaryCalculation?.totalCollection > 0 && (
          <div>
            {t("totalCollection")}:-৳
            {FormatNumber(summaryCalculation?.totalCollection)}
          </div>
        )}
    </div>
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
            customComponent={customComponent}
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
