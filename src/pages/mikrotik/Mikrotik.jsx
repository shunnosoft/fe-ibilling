import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "./mikrotik.css";
import { Plus, ArrowRightShort, PlusCircle } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import MikrotikPost from "./mikrotikModals/MikrotikPost";
import { fetchMikrotik } from "../../features/apiCalls";
import Table from "../../components/table/Table";

export default function Mikrotik() {
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);

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
        width: "15%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "22%",
        Header: "নাম",
        accessor: "name",
      },
      {
        width: "22%",
        Header: "হোস্ট",
        accessor: "host",
      },
      {
        width: "20%",
        Header: "পোর্ট",
        accessor: "port",
      },
      {
        width: "21%",
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
                  <div
                    title="মাইক্রোটিক এড করুন"
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#MikrotikModal"
                  >
                    <Plus />
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
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
