import "./area.css";
import React from "react";
import { useEffect, useState } from "react";
import { PersonPlusFill } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { ThreeDots, PenFill, ArchiveFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
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

export default function Area() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const area = useSelector((state) => state.area.area);
  const [isLoading, setIsLoading] = useState(false);
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
      toast("এরিয়া ডিলিট হয়েছে");
    }
  };

  return (
    <>
      <Sidebar />
      <ToastContainer
        className="bg-green"
        toastStyle={{
          backgroundColor: "#495057",
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

              <FourGround>
                <h2 className="collectorTitle">এরিয়া</h2>
                <div>
                  {isLoading ? (
                    <div className="deletingAction">
                      <Loader /> <b>Deleting...</b>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>অ্যাড এরিয়া</p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
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
                            placeholder="Search"
                          />
                        </div>
                      </div>
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
                            <td>পাওয়া যায়নি</td>
                          </tr>
                        ) : (
                          area.map((val, key) => (
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
                                  // data-bs-toggle="modal"
                                  // data-bs-target="#linemanEditModal"
                                  // onClick={() => {
                                  //   getSpecificLineman(val.mobile);
                                  // }}
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
