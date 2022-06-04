import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "./mikrotik.css";
import { Plus, ArrowRightShort } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import MikrotikPost from "./mikrotikModals/MikrotikPost";
// import { fetchMikrotik } from "../../features/mikrotikSlice";
// import { getMikrotik } from "../../features/mikrotikSlice";
import TdLoader from "../../components/common/TdLoader";
import { fetchMikrotik } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { Button } from "react-bootstrap";

export default function Mikrotik() {
  let serial = 0;
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const [msearch, setMsearch] = useState("");
  const dispatch = useDispatch();
  let allmikrotiks = [];
  allmikrotiks = useSelector(
    (state) => state.persistedReducer.mikrotik.mikrotik
  );

  useEffect(() => {
    const { ispOwner } = auth;
    fetchMikrotik(dispatch, ispOwner.id);
  }, [auth, dispatch]);

  const columns = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "নাম",
        accessor: "name",
      },
      {
        Header: "হোস্ট",
        accessor: "host",
      },
      {
        Header: "পোর্ট",
        accessor: "port",
      },
      {
        Header: <div className="text-center">অ্যাকশন</div>,
        id: "option1",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link
              to={`/mikrotik/${original.ispOwner}/${original.id}`}
              className="mikrotikConfigureButtom"
            >
              কনফিগার <ArrowRightShort style={{ fontSize: "19px" }} />
            </Link>
          </div>
        ),
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
              <MikrotikPost />
              {/* modals */}
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div>মাইক্রোটিক</div>
                  <button
                    title="মাইক্রোটিক এড করুন"
                    className="btn btn-outline-light btn-md"
                    data-bs-toggle="modal"
                    data-bs-target="#MikrotikModal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-plus-lg"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                      />
                    </svg>
                  </button>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  {/* <div className="addCollector">
                    <div className="addNewCollector">
                      <div className="addAndSettingIcon">
                        <Plus
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#MikrotikModal"
                        />
                      </div>
                    </div>
                  </div> */}

                  {/* table */}
                  <Table columns={columns} data={allmikrotiks}></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
