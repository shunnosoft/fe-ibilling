import React, { useEffect, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PersonFill,
  PenFill,
  ChatText,
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

import CollectorDetails from "./collectorCRUD/CollectorDetails";
import CollectorEdit from "./collectorCRUD/CollectorEdit";
import { getCollector } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";

export default function Collector() {
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const [collSearch, setCollSearch] = useState("");
  const collector = useSelector(
    (state) => state?.persistedReducer?.collector?.collector
  );

  let serial = 0;
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [collectorPerPage, setCollectorPerPage] = useState(5);
  const lastIndex = currentPage * collectorPerPage;
  const firstIndex = lastIndex - collectorPerPage;
  const currentCollector = collector.slice(firstIndex, lastIndex);
  const [allCollector, setCollector] = useState(currentCollector);
  const permission = useSelector(
    (state) => state.persistedReducer?.auth?.userData?.permissions
  );
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getCollector(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch]);

  const [singleCollector, setSingleCollector] = useState("");
  const getSpecificCollector = (id) => {
    if (collector.length !== undefined) {
      const temp = collector.find((val) => {
        return val.id === id;
      });
      setSingleCollector(temp);
    }
  };

  const [collectorId, setCollectorId] = useState();
  const handleSingleMessage = (collectorID) => {
    setCollectorId(collectorID);
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
              ? item[key].toString().toLowerCase().includes(collSearch)
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
        Header: "এড্রেস",
        accessor: "address",
      },
      {
        Header: "মোবাইল",
        accessor: "mobile",
      },
      {
        Header: "ইমেইল",
        accessor: "email",
      },

      {
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
              {original.mobile && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerMessageModal"
                  onClick={() => {
                    handleSingleMessage(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ChatText />
                      <p className="actionP">মেসেজ</p>
                    </div>
                  </div>
                </li>
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
                {permission?.collectorAdd ||
                  (role === "ispOwner" && (
                    <>
                      <button
                        title="কালেক্টর এড করুন"
                        className="btn btn-outline-light btn-md"
                        data-bs-toggle="modal"
                        data-bs-target="#collectorModal"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="currentColor"
                          class="bi bi-person-plus"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                          <path
                            fill-rule="evenodd"
                            d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                          />
                        </svg>
                      </button>
                    </>
                  ))}
              </div>

              <FourGround>
                <div className="collectorWrapper">
                  {/* <div className="addCollector">
                    <div className="addNewCollector">
                      <div className="displexFlexSys">
                        <div className="addAndSettingIcon"> */}
                  {/* <GearFill
                            className="addcutmButton"
                            // data-bs-toggle="modal"
                            // data-bs-target="#exampleModal"
                          /> */}
                  {/* </div>
                      </div>
                    </div>
                  </div> */}
                  <Table columns={columns} data={collector}></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
        {/* modals */}
        <CollectorPost />
        <CollectorDetails single={singleCollector} />
        <CollectorEdit single={singleCollector} />
        <SingleMessage single={collectorId} sendCustomer="collector" />
      </div>
    </>
  );
}
