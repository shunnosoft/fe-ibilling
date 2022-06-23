import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getStaticActiveCustomer } from "../../features/apiCalls";
import Table from "../../components/table/Table";
// get specific customer

import { Wifi, WifiOff } from "react-bootstrap-icons";

const StaticActiveCustomer = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const [filterStatus, setFilterStatus] = useState();

  // get all mikrotik from redux
  const mikrotik = useSelector(
    (state) => state.persistedReducer?.mikrotik?.mikrotik
  );

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0].id);

  // get all static customer
  let staticActiveCustomer = useSelector(
    (state) => state?.persistedReducer?.customer?.staticActiveCustomer
  );

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };

  // filter
  if (filterStatus && filterStatus !== "সকল গ্রাহক") {
    staticActiveCustomer = staticActiveCustomer.filter(
      (value) => value.complete === JSON.parse(filterStatus)
    );
  }

  // api call for get update static customer
  useEffect(() => {
    getStaticActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsloading);
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
        Header: "স্ট্যাটাস",
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
        Header: "নাম",
        accessor: "name",
      },
      {
        width: "20%",
        Header: "এড্রেস",
        accessor: "address",
      },
      {
        width: "30%",
        Header: "ম্যাক এড্রেস",
        accessor: "macAddress",
      },
    ],
    []
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}
              <FourGround>
                <h2 className="collectorTitle">স্ট্যাটিক এক্টিভ গ্রাহক</h2>
                <div className="collectorWrapper">
                  <div className="d-flex justify-content-center">
                    <div className="mikrotik-filter">
                      <h6 className="mb-0">মাইক্রোটিক সিলেক্ট করুন</h6>
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
                      <h6 className="mb-0">গ্রাহক সিলেক্ট করুন</h6>
                      <select
                        className="form-select mt-0"
                        aria-label="Default select example"
                        onChange={(event) =>
                          setFilterStatus(event.target.value)
                        }
                      >
                        <option selected>সকল গ্রাহক</option>
                        <option value={true}>একটিভ </option>
                        <option value={false}>ইনএকটিভ </option>
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

export default StaticActiveCustomer;
