import React, { useMemo } from "react";
import {
  ArchiveFill,
  CurrencyDollar,
  PenFill,
  PersonPlusFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";

import useDash from "../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AddCustomer from "./customerOperation/AddCustomer";
import EditCustomer from "./customerOperation/EditCustomer";
import { useEffect } from "react";
import { useState } from "react";
import {
  deleteHotspotCustomer,
  getHotspotCustomer,
} from "../../features/hotspotApi";
import moment from "moment";
import { badge } from "../../components/common/Utils";
import Footer from "../../components/admin/footer/Footer";
import Table from "../../components/table/Table";
import DeleteCustomer from "./customerOperation/DeleteCustomer";
import RechargeCustomer from "./customerOperation/RechargeCustomer";
import CustomersNumber from "../Customer/CustomersNumber";
const HotspotCustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get hotspot customer
  const customer = useSelector((state) => state.hotspot.customer);

  // loading state
  const [getCustomerLoading, setGetCustomerLoading] = useState(false);

  // delete loading
  const [deleteLoading, setDeleteLoading] = useState(false);

  // customer id state
  const [customerId, setCustomerId] = useState();

  // delete customer id state
  const [deleteCustomerId, setDeleteCustomerId] = useState();

  // set recharge id
  const [rechargeId, setRechargeId] = useState();

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);

  // customer get api call
  useEffect(() => {
    getHotspotCustomer(dispatch, ispOwnerId, setGetCustomerLoading);
  }, []);

  //column for table
  const columns = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "9%",
        Header: t("name"),
        Cell: ({ row: { original } }) => (
          <div
            style={{ cursor: "move" }}
            data-toggle="tooltip"
            data-placement="top"
            title={original.address}
          >
            {original.name}
          </div>
        ),
      },
      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },

      {
        width: "8%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("package"),
        accessor: "hotspot.profile",
      },
      {
        width: "8%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "11%",
        Header: t("date"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "11%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      {
        width: "6%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center justify-content-center">
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                {(permission?.billPosting || role === "ispOwner") && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#customerRecharge"
                    onClick={() => {
                      setRechargeId(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CurrencyDollar />
                        <p className="actionP">{t("recharge")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {(permission?.customerEdit || role === "ispOwner") && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#EditHotspotCustomer"
                    onClick={() => {
                      setCustomerId(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PenFill />
                        <p className="actionP">{t("edit")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {(permission?.customerDelete || role === "ispOwner") && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#hotsportCustomerDelete"
                    onClick={() => setDeleteCustomerId(original.id)}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP">{t("delete")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {/* {original.mobile &&
                  (permission?.sendSMS || role !== "collector" ? (
                    <li
                      data-bs-toggle="modal"
                      data-bs-target="#customerMessageModal"
                      onClick={() => {
                        getSpecificCustomer(original.id);
                      }}
                    >
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <ChatText />
                          <p className="actionP">{t("message")}</p>
                        </div>
                      </div>
                    </li>
                  ) : (
                    ""
                  ))} */}
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
                    <h2>{t("customer")}</h2>
                    {/* <div className="reloadBtn">
                      {customerLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise onClick={reloadHandler} />
                      )}
                    </div> */}
                  </div>
                  {/* customer page header area  */}

                  <div className="d-flex justify-content-center align-items-center">
                    {((role === "manager" && permission?.customerEdit) ||
                      role === "ispOwner") && (
                      <div
                        className="addAndSettingIcon"
                        title={t("customerNumberUpdateOrDelete")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-pencil-square addcutmButton"
                          viewBox="0 0 16 16"
                          onClick={() =>
                            setNumberModalShow({
                              ...numberModalShow,
                              [false]: true,
                            })
                          }
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fill-rule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                      </div>
                    )}

                    {(permission?.customerAdd || role === "ispOwner") && (
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#AddHotspotCustomer"
                          title={t("newCustomer")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </FourGround>
              <FourGround>
                {permission?.viewCustomerList || role !== "collector" ? (
                  <div className="collectorWrapper mt-2 py-2">
                    <div className="addCollector">
                      <div className="table-section">
                        <Table
                          isLoading={getCustomerLoading}
                          columns={columns}
                          data={customer}
                        ></Table>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <AddCustomer />
      <EditCustomer customerId={customerId} />
      <DeleteCustomer
        customerId={deleteCustomerId}
        mikrotikCheck={checkMikrotik}
        setMikrotikCheck={setMikrotikCheck}
      />
      <RechargeCustomer customerId={rechargeId} />

      {/* customers number update or delete modal */}
      <CustomersNumber showModal={numberModalShow} />
    </>
  );
};

export default HotspotCustomer;
