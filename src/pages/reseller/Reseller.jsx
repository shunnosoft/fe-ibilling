import React, { useState, useEffect } from "react";
import {
  PersonPlusFill,
  GearFill,
  ThreeDots,
  PenFill,
  ArchiveFill,
  PersonFill,
  Wallet,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "./reseller.css";
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ResellerPost from "./resellerModals/ResellerPost";
import ResellerEdit from "./resellerModals/ResellerEdit";
import Loader from "../../components/common/Loader";
import { getMikrotikPackages } from "../../features/apiCallReseller";
// import {
//   fetchReseller,
//   getReseller,
//   deleteReseller,
// } from "../../features/resellerSlice";
import TdLoader from "../../components/common/TdLoader";
import ResellerDetails from "./resellerModals/ResellerDetails";
import { deleteReseller, fetchReseller } from "../../features/apiCalls";
import Recharge from "./resellerModals/recharge";

export default function Reseller() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const [singleUser, setSingleUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rsearch, setRsearch] = useState("");
  const reseller = useSelector(
    (state) => state.persistedReducer.reseller.reseller
  );
  let serial = 0;
  useEffect(() => {
    if (auth.ispOwner) {
      fetchReseller(dispatch, auth.ispOwner.id);
    }
  }, [dispatch, auth.ispOwner]);

  // get Single reseller
  const getSpecificReseller = (rid) => {
    const singleReseller = reseller.find((val) => {
      return val.id === rid;
    });
    setSingleUser(singleReseller);
  };

  // delete reseller
  const deleteSingleReseller = async (ispId, resellerId) => {
    const IDs = { ispId: ispId, resellerId: resellerId };
    deleteReseller(dispatch, IDs, setIsLoading);
  };

  useEffect(() => {
    if (ispOwnerId !== undefined) {
      getMikrotikPackages(dispatch, ispOwnerId);
    }
  }, [dispatch, ispOwnerId]);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}
              <ResellerPost />
              {/* <ResellerRecharge reseller={singleUser}></ResellerRecharge> */}
              <ResellerEdit reseller={singleUser} />
              <ResellerDetails reseller={singleUser} />
              <Recharge reseller={singleUser}></Recharge>
              {/* modals */}
              <FourGround>
                <h2 className="collectorTitle">রিসেলার</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>অ্যাড রিসেলার</p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#resellerModal"
                        />
                      </div>
                    </div>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট রিসেলার : <span>{reseller.length || "NULL"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="Search"
                            onChange={(e) => setRsearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="deleteReseller">
                        <h6>
                          <Loader /> Deleting...
                        </h6>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th scope="col">Serial</th>
                          <th scope="col">নাম</th>
                          <th scope="col">এড্রেস</th>
                          <th scope="col">মোবাইল</th>
                          <th scope="col">ইমেইল</th>
                          <th scope="col">রিচার্জ ব্যালান্স</th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reseller.length === undefined ? (
                          <tr>
                            <TdLoader colspan={6} />
                          </tr>
                        ) : (
                          reseller
                            .filter((val) => {
                              return val.name
                                .toString()
                                .toLowerCase()
                                .includes(rsearch.toString().toLowerCase());
                            })
                            .map((val, key) => (
                              <tr key={key}>
                                <td>{++serial}</td>
                                <td>{val.name}</td>
                                <td>{val.address}</td>
                                <td>{val.mobile}</td>
                                <td>{val.email}</td>
                                <td>{val.rechargeBalance}</td>
                                <td style={{ textAlign: "center" }}>
                                  {/* dropdown */}

                                  <ThreeDots
                                    className="dropdown-toggle ActionDots"
                                    id="resellerDropdown"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  />

                                  {/* modal */}
                                  <ul
                                    className="dropdown-menu"
                                    aria-labelledby="resellerDropdown"
                                  >
                                    <li
                                      data-bs-toggle="modal"
                                      href="#resellerRechargeModal"
                                      role="button"
                                      onClick={() => {
                                        getSpecificReseller(val.id);
                                      }}
                                    >
                                      <div className="dropdown-item">
                                        <div className="customerAction">
                                          <Wallet />
                                          <p className="actionP">রিচার্জ</p>
                                        </div>
                                      </div>
                                    </li>
                                    {/* <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#resellerrechargehistory"
                                      role="button"
                                       
                                    >
                                      <div className="dropdown-item">
                                        <div className="customerAction">
                                          <Cash />
                                          <p className="actionP">রিচার্জ হিস্ট্রি</p>
                                        </div>
                                      </div>
                                    </li> */}
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#resellerDetailsModal"
                                      onClick={() => {
                                        getSpecificReseller(val.id);
                                      }}
                                    >
                                      <div className="dropdown-item">
                                        <div className="customerAction">
                                          <PersonFill />
                                          <p className="actionP">প্রোফাইল</p>
                                        </div>
                                      </div>
                                    </li>
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#resellerModalEdit"
                                      onClick={() => {
                                        getSpecificReseller(val.id);
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
                                        deleteSingleReseller(
                                          val.ispOwner,
                                          val.id
                                        );
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
