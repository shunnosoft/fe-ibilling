import React, { useState, useEffect } from "react";
import {
  PersonPlusFill,
  GearFill,
  ThreeDots,
  PenFill,
  ArchiveFill,
  PersonFill,
  Wallet,
  Person,
  PeopleFill,
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
import Table from "../../components/table/Table";
import { Link } from "react-router-dom";

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

  // const resellerCustomer = (resellerId) => {
  //   console.log(resellerId);

  // };

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
        Header: "রিচার্জ ব্যালান্স",
        accessor: "rechargeBalance",
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
            <ul className="dropdown-menu" aria-labelledby="resellerDropdown">
              <Link to={`/reseller/customer/${original.id}`}>
                <li>
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PeopleFill />

                      <p className="actionP">গ্রাহক</p>
                    </div>
                  </div>
                </li>
              </Link>

              <li
                data-bs-toggle="modal"
                href="#resellerRechargeModal"
                role="button"
                onClick={() => {
                  getSpecificReseller(original.id);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <Wallet />
                    <p className="actionP">রিচার্জ</p>
                  </div>
                </div>
              </li>
              <li
                data-bs-toggle="modal"
                data-bs-target="#resellerDetailsModal"
                onClick={() => {
                  getSpecificReseller(original.id);
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
                  getSpecificReseller(original.id);
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
                  deleteSingleReseller(original.ispOwner, original.id);
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

                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={reseller}
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
