import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// internal import
import { collectorAllPrevBalance } from "../../../features/apiCalls";
import Table from "../../../components/table/Table";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const PrevBalanceReport = ({ show, setShow, collectorId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get all prev balance data from redux store
  const allPrevBalance = useSelector((state) => state?.collector?.prevBalance);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // api call
  useEffect(() => {
    if (collectorId)
      collectorAllPrevBalance(dispatch, collectorId, setIsLoading);
  }, [collectorId]);

  const columns = useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: t("month"),
        accessor: "month",
      },

      {
        width: "18%",
        Header: t("year"),
        accessor: "year",
      },
      {
        width: "18%",
        Header: t("deposit"),
        accessor: "deposit",
      },
      {
        width: "18%",
        Header: t("billReport"),
        accessor: "billReport",
      },
      {
        width: "18%",
        Header: t("balance"),
        accessor: "balance",
      },
    ],
    [t]
  );

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"lg"}
        header={t("previousBalance")}
      >
        <div className="modal-body">
          <Table
            isLoading={isLoading}
            columns={columns}
            data={allPrevBalance}
          ></Table>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default PrevBalanceReport;
