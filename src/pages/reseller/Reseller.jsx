import React, { useState, useEffect } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PenFill,
  ArchiveFill,
  PersonFill,
  PeopleFill,
  ChatText,
  ArrowClockwise,
  CurrencyDollar,
  PencilSquare,
  KeyFill,
  CashStack,
  Book,
  FiletypePy,
  PlayBtn,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "./reseller.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ResellerPost from "./resellerModals/ResellerPost";
import Loader from "../../components/common/Loader";
import { getMikrotikPackages } from "../../features/apiCallReseller";
import ResellerDetails from "./resellerModals/ResellerDetails";
import {
  deleteReseller,
  fetchReseller,
  getArea,
  getPackagewithoutmikrotik,
} from "../../features/apiCalls";
import Recharge from "./resellerModals/recharge";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import EditResellerBalance from "./smsRecharge/modal/editResellerBalance";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import RechargeReport from "./resellerModals/RechargeReport";
import MonthlyReport from "./resellerModals/MonthlyReport";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import FormatNumber from "../../components/common/NumberFormat";
import ResellerEdit from "./resellerModals/ResellerEdit/ResellerEdit";
import { csutomerWebhookRegister } from "../../features/apiCallAdmin";
import PlayTutorial from "../tutorial/PlayTutorial";

const Reseller = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerData, ispOwnerId, hasMikrotik } = useISPowner();

  // get all reseller data form redux store
  const reseller = useSelector((state) => state?.reseller?.reseller);

  // reseller id state
  const [resellerId, setResellerId] = useState("");

  // user id state
  const [userId, setUserId] = useState();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // singl reseler sms id
  const [resellerSmsId, setResellerSmsId] = useState();

  // data loader
  const [dataLoader, setDataLoader] = useState(false);

  // modal open handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // get api call
  useEffect(() => {
    // get all reseller data api
    if (reseller.length == 0)
      fetchReseller(dispatch, ispOwnerId, setDataLoader);

    // get area api
    getArea(dispatch, ispOwnerId, setIsLoading);

    // get sub area api
    getSubAreasApi(dispatch, ispOwnerId);

    // get mikrotik packages
    getMikrotikPackages(dispatch, ispOwnerId);

    // get package without mikrotik
    !hasMikrotik &&
      getPackagewithoutmikrotik(ispOwnerId, dispatch, setIsLoading);
  }, []);

  // reload handler
  const reloadHandler = () => {
    fetchReseller(dispatch, ispOwnerId, setDataLoader);
  };

  // get Single reseller
  const getSpecificReseller = (id, resellerName) => {
    setResellerId(id);
  };

  // handle single sms method
  const handleSingleMessage = (resellerID) => {
    setResellerSmsId(resellerID);
  };

  // delete reseller
  const deleteSingleReseller = (ispId, resellerId) => {
    const IDs = { ispId: ispId, resellerId: resellerId };
    const confirm = window.confirm(t("resellerDelete"));
    if (confirm) {
      deleteReseller(dispatch, IDs, setIsLoading);
    }
  };

  // create customer webhook
  const createCustomerWebhookHandler = (reseller) => {
    const sendingData = {
      name: reseller.name,
      shunnoId: Number(ispOwnerData.netFeeId).toString(),
      password: `${reseller.mobile}NF`,
      resellerMobile: reseller.mobile,
      clientApp: "NETFEE",
      role: "WEBHOOK_USER",
    };

    // webhook api call
    csutomerWebhookRegister(sendingData);
  };

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
                  onClick={() => {
                    getSpecificReseller(original.id);
                    setModalStatus("recharge");
                    setShow(true);
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
                  onClick={() => {
                    getSpecificReseller(original.id);
                    setModalStatus("resellerEdit");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
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
                  onClick={() => {
                    getSpecificReseller(original.id);
                    setModalStatus("report");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CashStack />
                      <p className="actionP">{t("report")}</p>
                    </div>
                  </div>
                </li>

                <li
                  onClick={() => {
                    getSpecificReseller(original.id);
                    setModalStatus("previousReport");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CashStack />
                      <p className="actionP">{t("prevMonthReport")}</p>
                    </div>
                  </div>
                </li>

                {/* <Link to={`/reseller/online-payment-customer/${original.id}`}>
                  <li>
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PeopleFill />

                        <p className="actionP">{t("onlinePaymentCustomer")}</p>
                      </div>
                    </div>
                  </li>
                </Link> */}

                {original.mobile && (
                  <li
                    onClick={() => {
                      handleSingleMessage(original.id);
                      setModalStatus("message");
                      setShow(true);
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

                {role === "ispOwner" && (
                  <>
                    <li
                      onClick={() => {
                        getSpecificReseller(original.id);
                        setModalStatus("editBalance");
                        setShow(true);
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
                      onClick={() => {
                        getSpecificReseller(original.id);
                        setUserId(original.user);
                        setModalStatus("password");
                        setShow(true);
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

                {role === "ispOwner" && (
                  <li
                    onClick={() => {
                      createCustomerWebhookHandler(original);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <FiletypePy />
                        <p className="actionP">Create Reseller Webhook</p>
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

  //function to calculate total customer and balance
  const totalSum = () => {
    const initialValue = {
      customer: 0,
      balance: 0,
    };

    const calculatedValue = reseller?.reduce((previous, current) => {
      // total customer
      previous.customer += current.customerCount;

      // total balance
      previous.balance += current.rechargeBalance;

      return previous;
    }, initialValue);
    return calculatedValue;
  };

  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      <div className="me-3">
        {t("totalCustomer")}:
        <span className="fw-bold">{FormatNumber(totalSum().customer)}</span>
      </div>
      <div>
        {t("totalBalance")}:
        <span className="fw-bold"> ৳ {FormatNumber(totalSum().balance)}</span>
      </div>
    </div>
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("reseller")}</div>

                  {role === "ispOwner" && (
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="reloadBtn">
                        {dataLoader ? (
                          <Loader />
                        ) : (
                          <ArrowClockwise
                            className="arrowClock"
                            title={t("refresh")}
                            onClick={() => reloadHandler()}
                          ></ArrowClockwise>
                        )}
                      </div>

                      <div title={t("allResellerCustomer")}>
                        <Link to={`/reseller/customer`}>
                          <PeopleFill className="addcutmButton" />
                        </Link>
                      </div>

                      <div
                        title={t("addReseller")}
                        onClick={() => {
                          setModalStatus("resellerPost");
                          setShow(true);
                        }}
                      >
                        <PersonPlusFill className="addcutmButton" />
                      </div>

                      <div className="addAndSettingIcon">
                        <PlayBtn
                          className="addcutmButton"
                          onClick={() => {
                            setModalStatus("playTutorial");
                            setShow(true);
                          }}
                          title={t("tutorial")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-1">
                  <div className="table-section">
                    <Table
                      isLoading={dataLoader}
                      columns={columns}
                      data={reseller}
                      customComponent={customComponent}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* start modals section */}

      {/* reseller details modal */}
      <ResellerDetails resellerId={resellerId} />

      {/* add reseller modal */}
      {modalStatus === "resellerPost" && (
        <ResellerPost show={show} setShow={setShow} />
      )}

      {/* reseller edit modal */}
      {modalStatus === "resellerEdit" && (
        <ResellerEdit show={show} setShow={setShow} resellerId={resellerId} />
      )}

      {/* reseller rechare modal  */}
      {modalStatus === "recharge" && (
        <Recharge show={show} setShow={setShow} resellerId={resellerId} />
      )}

      {/* recharge report modal  */}
      {modalStatus === "report" && (
        <RechargeReport show={show} setShow={setShow} resellerId={resellerId} />
      )}

      {/* monthly report */}
      {modalStatus === "previousReport" && (
        <MonthlyReport show={show} setShow={setShow} resellerID={resellerId} />
      )}

      {/* reseller msg modal  */}
      {modalStatus === "message" && (
        <SingleMessage
          show={show}
          setShow={setShow}
          single={resellerSmsId}
          sendCustomer="reseller"
        />
      )}

      {/* reseler edit balnce modal  */}
      {modalStatus === "editBalance" && (
        <EditResellerBalance
          show={show}
          setShow={setShow}
          resellerId={resellerId}
        />
      )}

      {/* password reset modal */}
      {modalStatus === "password" && (
        <PasswordReset show={show} setShow={setShow} userId={userId} />
      )}

      {/* tutorial play modal */}
      {modalStatus === "playTutorial" && (
        <PlayTutorial
          {...{
            show,
            setShow,
            video: "reseller",
          }}
        />
      )}

      {/* end modals section*/}
    </>
  );
};

export default Reseller;
