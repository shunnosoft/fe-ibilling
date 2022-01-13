// extarnal imports
import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  PersonPlusFill,
  GearFill,
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import "./lineman.css";
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import LinemanPOST from "./linemanCRUD/LinemanPOST";
import {
  fetchLineman,
  setSingleLineman,
  deleteSingleLineman,
} from "../../features/linemanSlice";
import LinemanDetails from "./linemanCRUD/LinemanDetails";
import LinemanEdit from "./linemanCRUD/LinemanEdit";

export default function Lineman() {
  const auth = useSelector((state) => state.auth);
  const Linemans = useSelector((state) => state.lineman.lineman);
  const dispatch = useDispatch();
  let serial = 0;
  const [lineSearch, setLineSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (() => {
      const { ispOwner } = auth;
      if (isLoading) {
        dispatch(fetchLineman(ispOwner.id));
        setIsLoading(false);
      }
    })();
  }, [isLoading, auth, dispatch]);

  // getsingle lineman
  const getSpecificLineman = (mobile) => {
    if (Linemans.length !== undefined) {
      const oneLineman = Linemans.find((val) => {
        return val.mobile === mobile;
      });
      dispatch(setSingleLineman(oneLineman));
    }
  };

  // delete lineman
  const deleteLineman = (ID) => {
    const { ispOwner } = auth;
    const IDs = {
      ispID: ispOwner.id,
      linemanID: ID,
    };
    deleteSingleLineman(IDs);
  };

  return (
    <div>
      <Sidebar />
      <ToastContainer
        toastStyle={{ backgroundColor: "#992c0c", color: "white" }}
      />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">লাইন-ম্যান</h2>
              </FourGround>

              {/* modal start */}
              <LinemanPOST />
              <LinemanDetails />
              <LinemanEdit />
              {/* modal finish */}
              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>নতুন লাইন-ম্যান অ্যাড করুন </p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#linemanModal"
                        />
                        <GearFill
                          className="addcutmButton"
                          // data-bs-toggle="modal"
                          // data-bs-target=""
                        />
                      </div>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট লাইন-ম্যান:{" "}
                          <span>
                            {Linemans.length === undefined
                              ? "NULL"
                              : Linemans.length}
                          </span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          {/* <Search className="serchingIcon" /> */}
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য নাম লিখুন"
                            onChange={(e) => setLineSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end add collector */}

                  {/* table start */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th scope="col">সিরিয়াল</th>
                          <th scope="col">নাম</th>
                          <th scope="col">মোবাইল</th>
                          <th scope="col">এড্রেস</th>
                          <th scope="col">স্ট্যাটাস</th>
                          <th scope="col" className="centeringTD">
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Linemans.length === undefined ? (
                          <tr>
                            <td>Loading...</td>
                          </tr>
                        ) : (
                          Linemans.filter((val) => {
                            return val.name
                              .toLowerCase()
                              .includes(lineSearch.toLowerCase());
                          }).map((val, key) => (
                            <tr key={key} id={val.id}>
                              <td style={{ paddingLeft: "30px" }}>
                                {++serial}
                              </td>
                              <td>{val.name}</td>
                              <td>{val.mobile}</td>
                              <td>{val.address}</td>
                              <td>{val.status}</td>
                              <td className="centeringTD">
                                <ThreeDots
                                  className="dropdown-toggle ActionDots"
                                  id="linemanDropdown"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                />

                                {/* modal */}
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="linemanDropdown"
                                >
                                  <li
                                    onClick={() => {
                                      deleteLineman(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item actionManager">
                                      <div className="customerAction">
                                        <ArchiveFill />
                                        <p className="actionP">ডিলিট</p>
                                      </div>
                                    </div>
                                  </li>
                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#linemanEditModal"
                                    onClick={() => {
                                      getSpecificLineman(val.mobile);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PenFill />
                                        <p className="actionP">এডিট</p>
                                      </div>
                                    </div>
                                  </li>
                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#linemanDetails"
                                    onClick={() => {
                                      getSpecificLineman(val.mobile);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PersonFill />
                                        <p className="actionP">বিস্তারিত</p>
                                      </div>
                                    </div>
                                  </li>
                                </ul>

                                {/* end */}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </div>
  );
}
