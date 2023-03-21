import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-bootstrap";
import { ArrowClockwise, Wifi, WifiOff } from "react-bootstrap-icons";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Loader from "../../components/common/Loader";
import { useEffect } from "react";
import {
  getMikrotik,
  getStaticActiveCustomer,
} from "../../features/apiCallReseller";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";

const ActiveStaticCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get Isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get reseller id
  const resellerId = useSelector((state) =>
    role === "reseller"
      ? state.persistedReducer.auth?.userData?.id
      : state.persistedReducer.auth?.userData?.reseller
  );

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all static customer
  let staticActiveCustomer = useSelector(
    (state) => state?.customer?.staticActiveCustomer
  );

  // loading state
  const [isLoading, setIsLoading] = useState();

  // filter status state
  const [filterStatus, setFilterStatus] = useState();

  // mikrotikId state
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };

  // filter
  if (filterStatus && filterStatus !== t("sokolCustomer")) {
    staticActiveCustomer = staticActiveCustomer.filter(
      (value) => value.complete === JSON.parse(filterStatus)
    );
  }

  // reload handler
  const reloadHandler = () => {
    getStaticActiveCustomer(
      dispatch,
      ispOwnerId,
      resellerId,
      mikrotikId,
      setIsLoading
    );
  };

  useEffect(() => {
    setMikrotikId(mikrotik[0]?.id);
  }, [mikrotik]);

  useEffect(() => {
    getMikrotik(dispatch, resellerId);

    if (mikrotikId) {
      getStaticActiveCustomer(
        dispatch,
        ispOwnerId,
        resellerId,
        mikrotikId,
        setIsLoading
      );
    }
  }, [mikrotikId]);

  const columns = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: t("status"),
        accessor: "running",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.complete === true ? (
              <Wifi color="green" />
            ) : (
              <WifiOff color="red" />
            )}
          </div>
        ),
      },
      {
        width: "20%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "20%",
        Header: t("address"),
        accessor: "address",
      },
      {
        width: "30%",
        Header: t("macAddress"),
        accessor: "macAddress",
      },
    ],
    [t]
  );
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("activeStaticCustomer")}</h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 pt-4">
                  <div className="d-flex justify-content-center">
                    <div className="mikrotik-filter">
                      <h6 className="mb-0"> {t("selectMikrotik")} </h6>
                      <select
                        id="selectMikrotikOption"
                        onChange={mikrotiSelectionHandler}
                        className="form-select mt-0"
                      >
                        {mikrotik.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="customer-filter ms-4">
                      <h6 className="mb-0"> {t("selectCustomer")} </h6>
                      <select
                        className="form-select mt-0"
                        aria-label="Default select example"
                        onChange={(event) =>
                          setFilterStatus(event.target.value)
                        }
                      >
                        <option selected> {t("sokolCustomer")} </option>
                        <option value={true}> {t("active")} </option>
                        <option value={false}> {t("in active")} </option>
                      </select>
                    </div>
                  </div>
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={staticActiveCustomer}
                    />
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveStaticCustomer;
