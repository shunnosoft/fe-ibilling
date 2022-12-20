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
    </>
  );
};

export default HotspotCustomer;
