import React, { useEffect, useState } from "react";
import {
  PersonPlusFill,
  GearFill,
  ThreeDots,
  PersonFill,
  PenFill,
  ArchiveFill,
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
import Loader from "../../components/common/Loader";
 
import TdLoader from "../../components/common/TdLoader";
import CollectorDetails from "./collectorCRUD/CollectorDetails";
import CollectorEdit from "./collectorCRUD/CollectorEdit";
import { deleteCollector, getCollector } from "../../features/apiCalls";

export default function Collector() {
  const dispatch = useDispatch();
  const ispOwnerId = useSelector((state) => state.auth.ispOwnerId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [collSearch, setCollSearch] = useState("");
  const collector = useSelector(state=>state.collector.collector);
   
  let serial = 0;
  
  useEffect(() => {
   
    getCollector(dispatch,ispOwnerId)
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

  // DELETE collector
  const deleteCollectorHandler = async (ID) => {
     
    const IDs = { ispOwnerId, collectorId: ID };
   deleteCollector(dispatch,IDs,setIsDeleting);
    
  };

  return (
    <>
      <Sidebar />
      <ToastContainer
        toastStyle={{
          backgroundColor: "#677078",
          fontWeight: "500",
          color: "white",
        }}
      />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <h2 className="collectorTitle">কালেক্টর</h2>

              {/* modals */}
              <CollectorPost />
              <CollectorDetails single={singleCollector} />
              <CollectorEdit single={singleCollector} />

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>নতুন কালেক্টর অ্যাড</p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#collectorModal"
                        />
                        <GearFill
                          className="addcutmButton"
                          // data-bs-toggle="modal"
                          // data-bs-target="#exampleModal"
                        />
                      </div>
                    </div>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট কালেক্টর:
                          <span>{collector.length || "NULL"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য নাম লিখুন"
                            onChange={(e) => setCollSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    {isDeleting ? (
                      <div className="deletingAction">
                        <Loader /> <b>Deleting...</b>
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
                          <th>সিরিয়াল</th>
                          <th>নাম</th>
                          <th>মোবাইল</th>
                          <th>ইমেইল</th>
                          <th className="centeringTD">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collector?.length === undefined ? (
                          <tr>
                            <TdLoader colspan={5} />
                          </tr>
                        ) : (
                          collector
                            .filter((val) => {
                              return val.name
                                .toLowerCase()
                                .includes(collSearch.toLowerCase());
                            })
                            .map((val, key) => (
                              <tr key={key}>
                                <td>{++serial}</td>
                                <td>{val.name}</td>
                                <td>{val.mobile}</td>
                                <td>{val.email}</td>
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
                                      data-bs-target="#showCollectorDetails"
                                      onClick={() => {
                                        getSpecificCollector(val.id);
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
                                      data-bs-target="#collectorEditModal"
                                      onClick={() => {
                                        getSpecificCollector(val.id);
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
                                        deleteCollectorHandler(
                                           
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
