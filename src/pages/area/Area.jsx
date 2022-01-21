import "./area.css";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThreeDots, PenFill, ArchiveFill, GeoAlt } from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ResellerPost from "./areaModals/AreaPost";
import { fetchArea } from "../../features/areaSlice";
import { deleteArea } from "../../features/areaSlice";
import AreaEdit from "./areaModals/AreaEdit";
import TdLoader from "../../components/common/TdLoader";

export default function Area() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const area = useSelector((state) => state.area.area);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [EditAarea, setEditAarea] = useState("");
  let serial = 0;

  const dispatchArea = () => {
    if (auth.ispOwner) {
      dispatch(fetchArea(auth.ispOwner.id));
    }
  };

  useEffect(() => {
    if (auth.ispOwner) {
      dispatch(fetchArea(auth.ispOwner.id));
    }
  }, [dispatch, auth.ispOwner]);

  const deleteSingleArea = async (id, ispOwner) => {
    setIsLoading(true);
    const IDs = {
      ispOwner: ispOwner,
      id: id,
    };
    const reaponse = await dispatch(deleteArea(IDs));
    if (reaponse) {
      setIsLoading(false);
      dispatchArea();
    }
  };

  const getSpecificArea = (id) => {
    if (area.length !== undefined) {
      const oneArea = area.find((val) => {
        return val.id === id;
      });
      setEditAarea(oneArea);
    }
  };

  return (
    <>
      <Sidebar />
      <ToastContainer
        className="bg-green"
        toastStyle={{
          backgroundColor: "#677078",
          color: "white",
          fontWeight: "500",
        }}
      />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}
              <ResellerPost />
              {/* area edit modal */}
              <AreaEdit oneArea={EditAarea} />

              <FourGround>
                <h2 className="collectorTitle">এরিয়া</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>অ্যাড এরিয়া</p>
                      <div className="addAndSettingIcon">
                        <GeoAlt
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#areaModal"
                        />
                      </div>
                    </div>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট এরিয়া: <span>{area ? area.length : "NULL"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য এরিয়া নাম টাইপ করুন "
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      {isLoading ? (
                        <div className="deletingAction">
                          <Loader /> <b>Deleting...</b>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th scope="col">সিরিয়াল</th>
                          <th scope="col">এরিয়া</th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {area.length === undefined ? (
                          <tr>
                            <TdLoader colspan={3} />
                          </tr>
                        ) : (
                          area
                            .filter((val) => {
                              return val.name
                                .toLowerCase()
                                .includes(search.toLowerCase());
                            })
                            .map((val, key) => (
                              <tr key={key}>
                                <td style={{ paddingLeft: "30px" }}>
                                  {++serial}
                                </td>
                                <td>{val.name}</td>
                                <td style={{ textAlign: "center" }}>
                                  {/* dropdown */}

                                  <ThreeDots
                                    className="dropdown-toggle ActionDots"
                                    id="areaDropdown"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  />

                                  {/* modal */}
                                  <ul
                                    className="dropdown-menu"
                                    aria-labelledby="areaDropdown"
                                  >
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#areaEditModal"
                                      onClick={() => {
                                        getSpecificArea(val.id);
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
                                      onClick={() => {
                                        deleteSingleArea(val.id, val.ispOwner);
                                      }}
                                    >
                                      <div className="dropdown-item actionManager">
                                        <div className="customerAction">
                                          <ArchiveFill />
                                          <p className="actionP">ডিলিট</p>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                  {/* dropdown */}
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
    </>
  );
}
