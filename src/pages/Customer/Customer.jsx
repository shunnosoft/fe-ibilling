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
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerModal from "./CustomerModal";
import {
  fetchCustomer,
  getCustomer,
  setSingleCustomer,
  deleteSingleCustomer,
} from "../../features/customerSlice";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerEdit from "./customerCRUD/CustomerEdit";

export default function Customer() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [cusSearch, setCusSearch] = useState("");
  let serial = 0;

  let Customers = [];
  Customers = useSelector(getCustomer);

  // get specific customer
  const getSpecificCustomer = (ID) => {
    if (Customers !== undefined) {
      const SingleCustomer = Customers.find((val) => {
        return val.mobile === ID;
      });
      dispatch(setSingleCustomer(SingleCustomer));
    }
  };

  // DELETE handler
  const deleteCustomer = (ID) => {
    const { ispOwner } = auth;
    const IDs = {
      ispID: ispOwner.id,
      customerID: ID,
    };
    deleteSingleCustomer(IDs);
  };

  useEffect(() => {
    const { ispOwner } = auth;
    dispatch(fetchCustomer(ispOwner.id));
  }, [auth, dispatch]);

  return (
    <>
      <Sidebar />
      <ToastContainer
        toastStyle={{ backgroundColor: "#992c0c", color: "white" }}
      />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">কাস্টমার</h2>
              </FourGround>

              {/* Model start */}
              <CustomerModal />
              <CustomerEdit />
              <CustomerDetails />
              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>নতুন কাস্টমার অ্যাড করুন </p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#customerModal"
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
                          মোট কাস্টমার : <span>{Customers.length}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          {/* <Search className="serchingIcon" /> */}
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য নাম লিখুন"
                            onChange={(e) => setCusSearch(e.target.value)}
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
                        {Customers.length === undefined ? (
                          <tr>
                            <td>কোনো কাস্টমার পাওয়া যায়নি</td>
                          </tr>
                        ) : (
                          Customers.filter((val) => {
                            return val.name
                              .toLowerCase()
                              .includes(cusSearch.toLowerCase());
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
                                  id="customerDrop"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                />

                                {/* modal */}
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="customerDrop"
                                >
                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#showCustomerDetails"
                                    onClick={() => {
                                      getSpecificCustomer(val.mobile);
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
                                    data-bs-target="#customerEditModal"
                                    onClick={() => {
                                      getSpecificCustomer(val.mobile);
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
                                      deleteCustomer(val.id);
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
    </>
  );
}
