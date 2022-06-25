import React, { useEffect, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PersonFill,
  PenFill,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "./collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import CollectorPost from "./collectorCRUD/CollectorPost";
// import Loader from "../../components/common/Loader";
import Pagination from "../../components/Pagination";

import TdLoader from "../../components/common/TdLoader";
import CollectorDetails from "./collectorCRUD/CollectorDetails";
import CollectorEdit from "./collectorCRUD/CollectorEdit";
import { getCollector, getSubAreas } from "../../features/apiCallReseller";
import Table from "../../components/table/Table";

export default function Collector() {
  const dispatch = useDispatch();
  const [collSearch, setCollSearch] = useState("");
  const collector = useSelector(
    (state) => state.persistedReducer.collector.collector
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  let serial = 0;
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [collectorPerPage, setCollectorPerPage] = useState(5);
  const [isLoading, setIsloading] = useState(false);
  const lastIndex = currentPage * collectorPerPage;
  const firstIndex = lastIndex - collectorPerPage;
  const currentCollector = collector.slice(firstIndex, lastIndex);
  const [allCollector, setCollector] = useState(currentCollector);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permission
  );
  const role = useSelector((state) => state.persistedReducer.auth.role);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getCollector(dispatch, userData.id);
    getSubAreas(dispatch, userData.id);
  }, [userData, dispatch]);

  const [singleCollector, setSingleCollector] = useState("");
  const getSpecificCollector = (id) => {
    if (collector.length !== undefined) {
      const temp = collector.find((val) => {
        return val.id === id;
      });
      setSingleCollector(temp);
    }
  };

  // DELETE collector
  // const deleteCollectorHandler = async (ID) => {
  //   const IDs = { ispOwnerId, collectorId: ID };
  //   deleteCollector(dispatch, IDs, setIsDeleting);
  // };
  // console.log(allCollector)

  useEffect(() => {
    const keys = ["name", "mobile", "email"];
    if (collSearch !== "") {
      setCollector(
        collector.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key]?.toString().toLowerCase().includes(collSearch)
              : item[key].toString().includes(collSearch)
          )
        )
      );
    } else {
      setCollector(collector);
    }
  }, [collSearch, collector]);

  const searchHandler = (e) => {
    setCollSearch(e.toString().toLowerCase());
  };
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
        width: "23%",
        Header: "এড্রেস",
        accessor: "address",
      },
      {
        width: "20%",
        Header: "মোবাইল",
        accessor: "mobile",
      },
      {
        width: "20%",
        Header: "ইমেইল",
        accessor: "email",
      },

      {
        width: "20%",
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu" aria-labelledby="customerDrop">
              <li
                data-bs-toggle="modal"
                data-bs-target="#showCollectorDetails"
                onClick={() => {
                  getSpecificCollector(original.id);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <PersonFill />
                    <p className="actionP">প্রোফাইল</p>
                  </div>
                </div>
              </li>
              {permission?.collectorEdit || role === "ispOwner" ? (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#collectorEditModal"
                  onClick={() => {
                    getSpecificCollector(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">এডিট</p>
                    </div>
                  </div>
                </li>
              ) : (
                ""
              )}
            </ul>
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
              <div className="collectorTitle d-flex justify-content-between px-5">
                <div>কালেক্টর</div>

                {userData.permission?.customerAdd || role === "ispOwner" ? (
                  <div
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#collectorModal"
                  >
                    <PersonPlusFill />
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* modals */}
              <CollectorPost />
              <CollectorDetails single={singleCollector} />
              <CollectorEdit single={singleCollector} />

              <FourGround>
                <div className="collectorWrapper">
                  {/* table */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={collector}
                    ></Table>
                  </div>
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
