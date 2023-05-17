import React, { useState, useEffect } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PenFill,
  ArchiveFill,
  PersonFill,
  PeopleFill,
  ChatText,
  ArrowRightShort,
  ArrowClockwise,
  CurrencyDollar,
  PencilSquare,
  KeyFill,
  CashStack,
  Book,
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

import ResellerDetails from "./resellerModals/ResellerDetails";
import {
  deleteReseller,
  fetchReseller,
  getArea,
} from "../../features/apiCalls";
import Recharge from "./resellerModals/recharge";
import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
// import { getResellerCustomer } from "../../features/resellerCustomerAdminApi";
import { useTranslation } from "react-i18next";
import EditResellerBalance from "./smsRecharge/modal/editResellerBalance";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import RechargeReport from "./resellerModals/RechargeReport";
import MonthlyReport from "./resellerModals/MonthlyReport";
import { getSubAreasApi } from "../../features/actions/customerApiCall";

export default function Reseller() {
  const { t } = useTranslation();

  // import dispatch
  const dispatch = useDispatch();

  // get all auth
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get all reseller
  const reseller = useSelector((state) => state?.reseller?.reseller);

  // reseller id state
  const [resellerId, setResellerId] = useState("");

  // user id state
  const [userId, setUserId] = useState();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // singl reseler sms id
  const [resellerSmsId, setResellerSmsId] = useState();

  // reseller name state
  const [resellerName, setResellerName] = useState("");

  // data loader
  const [dataLoader, setDataLoader] = useState(false);

  // reload handler
  const reloadHandler = () => {
    fetchReseller(dispatch, auth.ispOwner.id, setDataLoader);
  };

  // get Single reseller
  const getSpecificReseller = (id, resellerName) => {
    setResellerId(id);
    setResellerName(resellerName);
  };

  // handle single sms method
  const handleSingleMessage = (resellerID) => {
    setResellerSmsId(resellerID);
  };

  // delete reseller
  const deleteSingleReseller = (ispId, resellerId) => {
    const IDs = { ispId: ispId, resellerId: resellerId };
    deleteReseller(dispatch, IDs, setIsLoading);
  };

  // reseller and area api call
  useEffect(() => {
    if (auth.ispOwner) {
      if (reseller.length == 0)
        fetchReseller(dispatch, auth.ispOwner.id, setDataLoader);
      getArea(dispatch, auth.ispOwner.id, setIsLoading);
      getSubAreasApi(dispatch, ispOwnerId);
    }
  }, [dispatch, auth.ispOwner]);

  // mikrotik package get api
  useEffect(() => {
    if (ispOwnerId !== undefined) {
      getMikrotikPackages(dispatch, ispOwnerId);
    }
  }, [ispOwnerId]);

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "12%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "19%",
        Header: t("address"),
        accessor: "address",
      },

      {
        width: "16%",
        Header: t("email"),
        accessor: "email",
      },
      {
        width: "12%",
        Header: t("customer"),
        accessor: "customerCount",
      },
      {
        width: "14%",
        Header: t("rechargeBalance"),
        accessor: "rechargeBalance",
        Cell: ({ cell: { value } }) => {
          return Math.floor(value);
        },
      },
      {
        width: "7%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="dropdown">
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

                        <p className="actionP">{t("customer")}</p>
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
                      <CurrencyDollar />
                      <p className="actionP">{t("useMemoRecharge")}</p>
                    </div>
                  </div>
                </li>

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#rechargeReport"
                  onClick={() => {
                    getSpecificReseller(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CashStack />
                      <p className="actionP">{t("report")}</p>
                    </div>
                  </div>
                </li>

                <Link to={`/reseller/summary/${original.id}`}>
                  <li>
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <Book />

                        <p className="actionP">{t("summary")}</p>
                      </div>
                    </div>
                  </li>
                </Link>

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#monthlyReport"
                  onClick={() => {
                    getSpecificReseller(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CashStack />
                      <p className="actionP">{t("prevMonthReport")}</p>
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
                      <p className="actionP">{t("profile")}</p>
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
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
                {role === "ispOwner" && (
                  <>
                    <li
                      data-bs-toggle="modal"
                      data-bs-target="#resellerBalanceEditModal"
                      onClick={() => {
                        getSpecificReseller(original.id);
                      }}
                    >
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <PencilSquare />
                          <p className="actionP">{t("editBalance")}</p>
                        </div>
                      </div>
                    </li>

                    <li
                      data-bs-toggle="modal"
                      data-bs-target="#resetPassword"
                      onClick={() => {
                        getSpecificReseller(original.id);
                        setUserId(original.user);
                      }}
                    >
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <KeyFill />
                          <p className="actionP">{t("passwordReset")}</p>
                        </div>
                      </div>
                    </li>
                  </>
                )}

                <li
                  onClick={() => {
                    deleteSingleReseller(original.ispOwner, original.id);
                  }}
                >
                  <div className="dropdown-item actionManager">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">{t("delete")}</p>
                    </div>
                  </div>
                </li>

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
                        <p className="actionP">{t("message")}</p>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("reseller")}</div>
                    <div className="reloadBtn">
                      {dataLoader ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                  {role === "ispOwner" && (
                    <div className="d-flex">
                      <div
                        className="settingbtn me-2"
                        style={{ marginTop: "-8px" }}
                      >
                        <Link
                          to={`/reseller/customer`}
                          className="mikrotikConfigureButtom"
                          style={{
                            height: "40px",
                            fontSize: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {t("allResellerCustomer")}
                          <ArrowRightShort style={{ fontSize: "19px" }} />
                        </Link>
                      </div>
                      <div
                        title={t("addReseller")}
                        className="header_icon"
                        data-bs-toggle="modal"
                        data-bs-target="#resellerModal"
                      >
                        <PersonPlusFill />
                      </div>
                    </div>
                  )}
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="table-section">
                      <Table
                        isLoading={dataLoader}
                        columns={columns}
                        data={reseller}
                      ></Table>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* start modals section */}
      {/* add reseller modal */}
      <ResellerPost />

      {/* reseller edit modal */}
      <ResellerEdit resellerId={resellerId} />

      {/* reseller details modal */}
      <ResellerDetails resellerId={resellerId} />

      {/* reseller rechare modal  */}
      <Recharge resellerId={resellerId} />

      {/* recharge report  */}
      <RechargeReport resellerId={resellerId} />

      {/* monthly report */}
      <MonthlyReport resellerID={resellerId} />

      {/* reseller msg modal  */}
      <SingleMessage single={resellerSmsId} sendCustomer="reseller" />

      {/* reseler edit balnce modal  */}
      <EditResellerBalance resellerId={resellerId} />

      {/* password reset modal */}
      <PasswordReset resetCustomerId={userId} />

      {/* end modals section*/}
    </>
  );
}
