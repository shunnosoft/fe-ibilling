import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "./configmikrotik.css";
import {
  ArrowClockwise,
  PencilFill,
  ArrowLeftShort,
  Trash2Fill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ConfigMikrotikModal from "./configMikrotikModals/ConfigMikrotikModal";
import {
  fetchMikrotik,
  fetchSingleMikrotik,
  getSingleMikrotik,
  deleteSingleMikrotik,
} from "../../features/mikrotikSlice";
import Loader from "../../components/common/Loader";
// import TdLoader from "../../components/common/TdLoader";

export default function ConfigMikrotik() {
  const navigate = useNavigate();
  const { ispOwner, mikrotikId } = useParams();
  const singleMik = useSelector(getSingleMikrotik);
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  // let serial = 0;
  // const auth = useSelector((state) => state.auth);
  // const [msearch, setMsearch] = useState("");
  // const dispatch = useDispatch();
  // let allmikrotiks = [];
  // allmikrotiks = useSelector(getMikrotik);

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwner,
      id: mikrotikId,
    };
    dispatch(fetchSingleMikrotik(IDs));
  }, [ispOwner, mikrotikId, dispatch]);

  const gotoAllMiktorik = () => {
    navigate(-1);
  };

  const deleteSingleMKHandler = async () => {
    if (window.confirm("মাইক্রোটিক ডিলিট করতে চান?") === true) {
      setIsloading(true);
      const IDs = {
        ispOwner: ispOwner,
        id: mikrotikId,
      };
      const res = await dispatch(deleteSingleMikrotik(IDs));
      if (res) {
        setIsloading(false);
        dispatch(fetchMikrotik(ispOwner));
        navigate("/mikrotik");
      }
    }
  };
  return (
    <>
      <Sidebar />
      <ToastContainer
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
              <ConfigMikrotikModal mik={singleMik} />
              <FourGround>
                <h2 className="collectorTitle">মাইক্রোটিক কনফিগারেশন</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>মাইক্রোটিক কনফিগারেশন</p>
                      <div className="addAndSettingIcon">
                        <PencilFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#configMikrotikModal"
                        />
                        <ArrowClockwise
                          className="addcutmButton"
                          //   data-bs-toggle="modal"
                          //   data-bs-target="#exampleModal"
                        />
                        <Trash2Fill
                          className="addcutmButton deleteColorBtn"
                          onClick={deleteSingleMKHandler}
                        />
                        {isLoading ? (
                          <div className="deletingAction">
                            <Loader /> <b>Deleting...</b>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="mikrotikDetails mt-5">
                        <p>
                          নামঃ <b>{singleMik.name || "Loading..."}</b>
                        </p>
                        <p>
                          আইপিঃ <b>{singleMik.host || "Loading..."}</b>
                        </p>
                        <p>
                          ইউজারনেমঃ <b>{singleMik.username || "Loading..."}</b>
                        </p>
                        <p>
                          পোর্টঃ <b>{singleMik.port || "Loading..."}</b>
                        </p>
                      </div>
                    </div>

                    <div className="AllMikrotik" onClick={gotoAllMiktorik}>
                      <ArrowLeftShort className="arrowLeftSize" />
                      <span style={{ marginLeft: "3px" }}>সকল মাইক্রোটিক</span>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          PPPoE প্যাকেজ: <span>1</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য নাম টাইপ করুন"
                            // onChange={(e) => setMsearch(e.target.value)}
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
                          <th scope="col">হোস্ট</th>
                          <th scope="col">পোর্ট</th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ paddingLeft: "30px" }}>Td</td>
                          <td>Td</td>
                          <td>Td</td>
                          <td>Td</td>
                          <td style={{ textAlign: "center" }}>Td</td>
                        </tr>
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
