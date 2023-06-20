import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  deleteMikrotikCustomer,
  getExtraMikrotikCustomers,
} from "../../../../features/apiCalls";
import Table from "../../../../components/table/Table";
import { useSelector } from "react-redux";
import { ArchiveFill, ThreeDots } from "react-bootstrap-icons";
import moment from "moment";

const MikrotikCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwnerId & mikrotikId from params
  const { ispOwnerId, mikrotikId } = useParams();

  // loading sates
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // get data from redux
  const allUsers = useSelector((state) => state.crossCustomer.mikrotikCustomer);

  // customer delete handler
  const deleteCustomer = (name) => {
    const data = {
      mikrotikId,
      ispOwnerId,
      name,
    };

    const confirm = window.confirm(t("deleteCustomer"));
    if (confirm) {
      deleteMikrotikCustomer(dispatch, data, setDeleteLoading);
    }
  };

  // customer column
  const customerColumn = React.useMemo(
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
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "20%",
        Header: t("package"),
        accessor: "profile",
      },
      {
        width: "20%",
        Header: t("lastLoggedOut"),
        accessor: "lastLoggedOut",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.lastLoggedOut &&
              moment(original.lastLoggedOut).format("MMM DD YYYY hh:mm A")}
          </div>
        ),
      },
      {
        width: "8%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul
                className="dropdown-menu"
                aria-labelledby="pppoePackageDropdown"
              >
                <li
                  onClick={() => {
                    deleteCustomer(original.name);
                  }}
                >
                  <div className="dropdown-item actionManager">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">{t("delete")}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  useEffect(() => {
    // get data api call
    getExtraMikrotikCustomers(mikrotikId, ispOwnerId, setIsLoading, dispatch);
  }, [mikrotikId]);
  return (
    <>
      <div className="collectorWrapper mt-2 py-2">
        <div className="addCollector">
          <Table
            isLoading={isLoading}
            columns={customerColumn}
            data={allUsers}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default MikrotikCustomer;
