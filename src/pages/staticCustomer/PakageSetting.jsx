import React, { useEffect, useState } from "react";
import {
  ThreeDots,
  PersonFill,
  PenFill,
  PlusLg,
  ArrowLeftShort,
  ArchiveFill,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import {
  deleteStaticPackage,
  getQueuePackageByIspOwnerId,
} from "../../features/apiCalls";
import CreatePackage from "./CreatePackageModal";
import EditPackage from "./EditPackageModal";
import { NavLink } from "react-router-dom";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";

export default function PackageSetting() {
  const { t } = useTranslation();
  // get all package list
  let packages = useSelector((state) => state?.package?.packages);

  // delete local state
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  // import dispatch
  const dispatch = useDispatch();

  // const [collSearch, setCollSearch] = useState("");

  // const collector = useSelector(
  //   (state) => state.persistedReducer.collector.collector
  // );

  // const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  // let serial = 0;

  // get login user role
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);

  // get mikrotik from state
  const mikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );

  // set filter status
  const [filterStatus, setFilterStatus] = useState(null);

  // filter mikrotk
  if (filterStatus && filterStatus !== "মাইক্রোটিক") {
    packages = packages.filter((value) => value.mikrotik === filterStatus);
  }

  // get queue packages
  useEffect(() => {
    getQueuePackageByIspOwnerId(ispOwnerId, dispatch, setIsloading);
  }, [ispOwnerId, dispatch]);

  // set editable data for state
  const [singlePackage, setSinglePackage] = useState("");

  // handle edit function
  const getSpecificPackage = (val) => {
    setSinglePackage(val);
  };

  // const searchHandler = (e) => {
  //   setCollSearch(e.toString().toLowerCase());
  // };

  // delete handle function
  const deletePackageHandler = (packageId) => {
    const con = window.confirm(t("doWantDeletePackage"));
    if (con) {
      setIsDeleting(true);
      deleteStaticPackage(dispatch, packageId);
    }
  };

  // table column
  const columns1 = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "প্যাকেজ",
        accessor: "name",
      },
      {
        Header: "রেট",
        accessor: "rate",
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
              {
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#editPackage"
                  onClick={() => {
                    getSpecificPackage(original);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">এডিট</p>
                    </div>
                  </div>
                </li>
              }
              <li
                onClick={() => {
                  deletePackageHandler(original.id);
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
          </div>
        ),
      },
    ],
    []
  );
  return (
    <>
      <CreatePackage></CreatePackage>
      <EditPackage package={singlePackage}></EditPackage>

      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <h2 className="collectorTitle">{t("staticPackageSetting")} </h2>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    {role === "ispOwner" && (
                      <div className="addNewCollector">
                        <div className="displexFlexSys">
                          <div>
                            <NavLink to={"/staticCustomer"}>
                              <div className="AllMikrotik">
                                <ArrowLeftShort
                                  style={{ fontSize: "30px" }}
                                  className="arrowLeftSize"
                                />
                                <span style={{ marginLeft: "3px" }}></span>
                              </div>
                            </NavLink>
                          </div>
                          <div className="mikrotiKFilter">
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              onChange={(event) =>
                                setFilterStatus(event.target.value)
                              }
                            >
                              <option selected>{t("mikrotik")}</option>
                              {mikrotik.map((item) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="addAndSettingIcon">
                            {
                              <PlusLg
                                className="addcutmButton"
                                data-bs-toggle="modal"
                                data-bs-target="#createPackage"
                              />
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Table
                    isLoading={isLoading}
                    columns={columns1}
                    data={packages}
                  ></Table>
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

// import React, { useEffect, useState } from "react";
// import "../collector/collector.css";
// import {
//   PlugFill,
//   ArrowClockwise,
//   PencilFill,
//   ArrowLeftShort,
//   ThreeDots,
//   PenFill,
//   ArchiveFill,
//   PersonSquare,
//   PersonCheckFill,
//   BagCheckFill,
// } from "react-bootstrap-icons";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router";
// // import { Link } from "react-router-dom";

// // internal imports
// import { toast, ToastContainer } from "react-toastify";
// import useDash from "../../assets/css/dash.module.css";
// import Sidebar from "../../components/admin/sidebar/Sidebar";
// import { FourGround, FontColor } from "../../assets/js/theme";
// import Footer from "../../components/admin/footer/Footer";

// import Loader from "../../components/common/Loader";

// import Table from "../../components/table/Table";
// import { NavLink } from "react-router-dom";
// // import TdLoader from "../../components/common/TdLoader";

// export default function PackageSetting() {
//   const navigate = useNavigate();

//   const { ispOwner, mikrotikId } = useParams();

//   const allMikrotikUsers = useSelector(
//     (state) => state.persistedReducer.mikrotik.pppoeUser
//   );
//   const activeUser = useSelector(
//     (state) => state.persistedReducer.mikrotik.pppoeActiveUser
//   );
//   const pppoePackage = useSelector(
//     (state) => state.persistedReducer.mikrotik.pppoePackage
//   );
//   const mtkIsLoading = useSelector(
//     (state) => state.persistedReducer.mikrotik.isLoading
//   );
//   // const mikrotikSyncUser = useSelector(
//   //   state => state.mikrotik.mikrotikSyncUser
//   // );

//   // const [isLoading, setIsloading] = useState(false);
//   const [isLoadingPac, setIsLoadingPac] = useState(false);
//   const [isLoadingCus, setIsLoadingCus] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isChecking, setIsChecking] = useState(false);
//   const [singlePackage, setSinglePackage] = useState("");
//   const [whatYouWantToShow, setWhatYouWantToShow] = useState(
//     "showMikrotikPackage"
//   );

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const zeroRate = pppoePackage.filter(
//       (i) =>
//         i.rate === 0 && i.name !== "default-encryption" && i.name !== "default"
//     );
//     if (zeroRate.length !== 0) {
//       toast.warn(`${zeroRate[0].name} প্যাকেজ
//       এর রেট আপডেট করুন`);
//     }
//   }, [pppoePackage]);

//   // get single pppoe package
//   const getSpecificPPPoEPackage = (id) => {
//     if (pppoePackage.length !== undefined) {
//       const temp = pppoePackage.find((val) => {
//         return val.id === id;
//       });
//       setSinglePackage(temp);
//     }
//   };

//   // delete single pppoe package
//   const deleteSinglePPPoEpackage = async (mikrotikID, Id) => {
//     const con = window.confirm("আপনি কি প্যাকেজ ডিলিট করতে চান?");
//     if (con) {
//       setIsDeleting(true);
//       const IDs = {
//         mikrotikId: mikrotikID,
//         pppPackageId: Id,
//       };
//     }
//   };

//   return (
//     <>
//       <Sidebar />
//       <ToastContainer position="top-right" theme="colored" />
//       <div className={useDash.dashboardWrapper}>
//         <div className="container-fluied collector">
//           <div className="container">
//             <FontColor>
//               <FourGround>
//                 <h2 className="collectorTitle">স্ট্যাটিক প্যাকেজে সেটিং</h2>
//               </FourGround>

//               <FourGround>
//                 <div className="collectorWrapper">
//                   <div className="addCollector">

//                     <div className="addNewCollector showMikrotikUpperSection"></div>

//                     <div>
//                     </div>
//                   </div>
//                 </div>
//               </FourGround>
//               <Footer />
//             </FontColor>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
