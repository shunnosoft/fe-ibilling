import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Cash,
  CashStack,
  Diagram2,
  EnvelopePlus,
  FileEarmarkBarGraph,
  GraphDown,
  GraphDownArrow,
  GraphUpArrow,
  People,
  Person,
  PersonCheck,
  PersonDown,
  PersonLinesFill,
  PersonLock,
  PersonUp,
  PersonX,
  Phone,
  Reception3,
  Reception4,
  SendCheck,
  Wallet,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

// internal imports
import "./dashboardCard.css";
import FormatNumber from "../../../components/common/NumberFormat";
import DotLoder from "./DotLoder";
import Active from "../dataComponent/Active";
import Inactive from "../dataComponent/Inactive";
import Expired from "../dataComponent/Expired";
import Paid from "../dataComponent/Paid";
import Unpaid from "../dataComponent/Unpaid";
import FreeCustomer from "../dataComponent/FreeCustomer";
import Discount from "../dataComponent/Discount";
import AllCollector from "../dataComponent/AllCollector";
import Reseller from "../dataComponent/Reseller";
import AllManager from "../dataComponent/AllManager";

const DashboardCard = ({ dashboardCard, isLoading, filterDate, cardRole }) => {
  const { t } = useTranslation();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, bpSettings, permissions, currentUser } =
    useISPowner();

  // modal close handler
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);

  // user role and permission handle
  const userHandle =
    role === "ispOwner" ||
    (role === "manager" && permissions.dashboardCollectionData) ||
    (role === "collector" &&
      !currentUser.collector.reseller &&
      permissions.dashboardCollectionData) ||
    role === "reseller" ||
    (role === "collector" && currentUser.collector.reseller);

  // admin staff user role permission
  const adminUser =
    role === "ispOwner" ||
    role === "manager" ||
    (role === "collector" && !currentUser.collector.reseller);

  // own totoal collection in role base
  const ownTotalCollection = () => {
    if (["ispOwner", "manager"].includes(role)) {
      return bpSettings?.dashboardProbabilityAmountWithNewCustomer
        ? Math.abs(
            dashboardCard.totalMonthlyCollection -
              dashboardCard.totalMonthlyDiscount
          )
        : dashboardCard.totalMonthlyCollection -
            dashboardCard.newCustomerBillCollection -
            dashboardCard.totalMonthlyDiscount;
    } else if (role === "collector" && !currentUser.collector.reseller) {
      return bpSettings?.dashboardProbabilityAmountWithNewCustomer
        ? Math.abs(dashboardCard.totalMonthlyCollection)
        : dashboardCard.totalMonthlyCollection -
            dashboardCard.newCustomerBillCollection;
    } else {
      return Math.abs(dashboardCard.totalMonthlyCollection);
    }
  };

  // dashboard customer modal click handler
  const modlaClickHandler = (value) => {
    setStatus(value);
    setShow(true);
  };

  return (
    <>
      <div className="container">
        {/* dashboard over view card data end */}
        {cardRole === "overView" && (
          <div class="row dashboard_card">
            <div class="col-md-4 col-xl-3">
              <div class="card bg-card-01 order-card">
                <div class="card-block display_card">
                  <p class="m-b-20">{t("totalCustomer")}</p>
                  <div class="d-flex align-items-center">
                    <p className="card_Icon">
                      <People />
                    </p>
                    <h2>{FormatNumber(dashboardCard.customers)}</h2>
                  </div>
                  <p class="m-b-0">
                    <Link to={"/other/customer"} className="text-white">
                      {t("newCustomer")}
                    </Link>

                    <span class="f-right">
                      {FormatNumber(dashboardCard.newCustomer)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-xl-3">
              <div class="card bg-card-02 order-card">
                <div class="card-block display_card">
                  <p class="m-b-20">{t("activeCustomer")}</p>
                  <div class="d-flex align-items-center">
                    <p className="card_Icon">
                      <PersonCheck />
                    </p>
                    <h2
                      className={adminUser && "clickable"}
                      onClick={() => adminUser && modlaClickHandler("active")}
                    >
                      {FormatNumber(dashboardCard.active)}
                    </h2>
                    &nbsp; &nbsp;
                    {userHandle && (
                      <span className="total_collection_amount">
                        ৳{FormatNumber(dashboardCard.totalActiveAmount)}
                      </span>
                    )}
                  </div>
                  <p class="m-b-0">
                    {t("newCustomer")}
                    <span class="f-right">
                      {FormatNumber(dashboardCard.newCustomerActive)}
                      {userHandle && (
                        <span>
                          / ৳
                          {FormatNumber(dashboardCard.newCustomerActiveAmount)}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-xl-3">
              <div class="card bg-card-03 order-card">
                <div class="card-block display_card">
                  <p class="m-b-20">{t("paidCustomer")}</p>
                  <div class="d-flex align-items-center">
                    <p className="card_Icon">
                      <PersonUp />
                    </p>
                    <h2
                      className={adminUser && "clickable"}
                      onClick={() => adminUser && modlaClickHandler("paid")}
                    >
                      {FormatNumber(dashboardCard.paid)}
                    </h2>
                    &nbsp; &nbsp;
                    {userHandle && (
                      <span className="total_collection_amount">
                        ৳{FormatNumber(dashboardCard.paidAmount)}
                      </span>
                    )}
                  </div>
                  <p class="m-b-0">
                    {t("newCustomer")}
                    <span class="f-right">
                      {FormatNumber(dashboardCard.newCustomerPaid)}
                      {userHandle && (
                        <span>
                          / ৳{FormatNumber(dashboardCard.newCustomerPaidAmount)}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-xl-3">
              <div class="card bg-card-04 order-card">
                <div class="card-block display_card">
                  <p class="m-b-20">{t("unpaidCustomer")}</p>
                  <div class="d-flex align-items-center">
                    <p className="card_Icon">
                      <PersonDown />
                    </p>
                    <h2
                      className={adminUser && "clickable"}
                      onClick={() => adminUser && modlaClickHandler("unpaid")}
                    >
                      {FormatNumber(dashboardCard.unpaid)}
                    </h2>
                    &nbsp; &nbsp;
                    {userHandle && (
                      <span className="total_collection_amount">
                        ৳{FormatNumber(Math.abs(dashboardCard.unpaidAmount))}
                      </span>
                    )}
                  </div>
                  <p class="m-b-0">
                    {t("newCustomer")}
                    <span class="f-right">
                      {FormatNumber(dashboardCard.newCustomerUnpaid)}
                      {userHandle && (
                        <span>
                          / ৳
                          {FormatNumber(dashboardCard.newCustomerUnpaidAmount)}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-xl-3">
              <div class="card bg-card-05 order-card">
                <div class="card-block display_card">
                  <p class="m-b-20">{t("expiredCustomer")}</p>
                  <div class="d-flex align-items-center">
                    <p className="card_Icon">
                      <PersonX />
                    </p>
                    <h2
                      className={adminUser && "clickable"}
                      onClick={() => adminUser && modlaClickHandler("expired")}
                    >
                      {FormatNumber(dashboardCard.expired)}
                    </h2>
                    &nbsp; &nbsp;
                    {userHandle && (
                      <span className="total_collection_amount">
                        ৳{FormatNumber(dashboardCard.totalExpiredAmount)}
                      </span>
                    )}
                  </div>
                  <p class="m-b-0">
                    {t("newCustomer")}
                    <span class="f-right">
                      {FormatNumber(dashboardCard.newCustomerExpired)}
                      {userHandle && (
                        <span>
                          / ৳
                          {FormatNumber(dashboardCard.newCustomerExpiredAmount)}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-xl-3">
              <div class="card bg-card-06 order-card">
                <div class="card-block display_card">
                  <p class="m-b-20">{t("inactiveCustomer")}</p>
                  <div class="d-flex align-items-center">
                    <p className="card_Icon">
                      <PersonLock />
                    </p>
                    <h2
                      className={adminUser && "clickable"}
                      onClick={() => adminUser && modlaClickHandler("inactive")}
                    >
                      {FormatNumber(dashboardCard.inactive)}
                    </h2>
                    &nbsp; &nbsp;
                    {userHandle && (
                      <span className="total_collection_amount">
                        ৳{FormatNumber(dashboardCard.totalInactiveAmount)}
                      </span>
                    )}
                  </div>
                  <p class="m-b-0">
                    {t("newCustomer")}
                    <span class="f-right">
                      {FormatNumber(dashboardCard.newCustomerInactive)}
                      {userHandle && (
                        <span>
                          / ৳
                          {FormatNumber(
                            dashboardCard.newCustomerInactiveAmount
                          )}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4 col-xl-3">
              <div class="card bg-card-07 order-card">
                <div class="card-block display_card">
                  <p class="m-b-20">{t("freeCustomer")}</p>
                  <div class="d-flex align-items-center">
                    <p className="card_Icon">
                      <Person />
                    </p>
                    <h2
                      className={adminUser && "clickable"}
                      onClick={() =>
                        adminUser && modlaClickHandler("freeCustomer")
                      }
                    >
                      {FormatNumber(dashboardCard.freeCustomer)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {userHandle && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-08 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("totalConnectionFee")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <Diagram2 />
                      </p>
                      <h2>
                        {FormatNumber(dashboardCard.totalMonthlyConnectionFee)}
                      </h2>
                    </div>
                    {role === "ispOwner" && (
                      <p class="m-b-0">
                        {t("todayConnectionFee")}
                        <span class="f-right">
                          {FormatNumber(dashboardCard.todayTotalConnectionFee)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {role === "reseller" && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-16 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("offlinePaymentCustomer")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <PersonLinesFill />
                      </p>
                      <h2>
                        {FormatNumber(
                          dashboardCard.offlinePaymentCustomerCount
                        )}
                      </h2>
                      &nbsp; &nbsp;
                      <span className="total_collection_amount">
                        ৳{FormatNumber(dashboardCard.offlinePaymentAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(role === "ispOwner" || role === "reseller") &&
              bpSettings?.hasPG && (
                <div class="col-md-4 col-xl-3">
                  <div class="card bg-card-13 order-card">
                    <div class="card-block display_card">
                      <p class="m-b-20">{t("onlinePaymentCustomer")}</p>
                      <div class="d-flex align-items-center">
                        <p className="card_Icon">
                          <Phone />
                        </p>
                        <h2>
                          {FormatNumber(
                            dashboardCard.onlinePaymentCustomerCount
                          )}
                        </h2>
                        &nbsp; &nbsp;
                        <span className="total_collection_amount">
                          ৳{FormatNumber(dashboardCard.onlinePaymentAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {(role === "ispOwner" || role === "reseller") && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-39 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("sendMoney")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <SendCheck />
                      </p>
                      <h2>
                        {FormatNumber(
                          dashboardCard.webhookPaymentCustomerCount
                        )}
                      </h2>
                      &nbsp; &nbsp;
                      <span className="total_collection_amount">
                        ৳{FormatNumber(dashboardCard.webhookPaymentAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {["ispOwner", "manager"].includes(role) && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-09 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("totalDiscount")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">%</p>
                      <h2
                        className={adminUser && "clickable"}
                        onClick={() =>
                          adminUser && modlaClickHandler("discount")
                        }
                      >
                        {FormatNumber(dashboardCard.totalMonthlyDiscount)}
                      </h2>
                    </div>
                    <p class="m-b-0">
                      {t("todayDiscount")}
                      <span class="f-right">
                        {FormatNumber(dashboardCard.todayTotalBillDiscount)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {userHandle && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-11 order-card">
                  <div class="card-block display_card">
                    <p className="m-b-20">
                      {`${t("totalCollection")} (${
                        bpSettings?.dashboardProbabilityAmountWithNewCustomer
                          ? t("withNew")
                          : t("withoutNew")
                      })`}
                    </p>

                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <Reception3 />
                      </p>
                      <h2>{FormatNumber(ownTotalCollection())}</h2>
                    </div>
                    <p class="m-b-0">
                      {t("newCustomer")}
                      <span class="f-right">
                        {FormatNumber(dashboardCard.newCustomerBillCollection)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {role === "ispOwner" && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-38 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("allCustomerCollection")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <Reception4 />
                      </p>
                      <h2>
                        {FormatNumber(dashboardCard.allCustomerCollection)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {userHandle && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-37 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("todayCollection")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <Cash />
                      </p>
                      <h2>{FormatNumber(dashboardCard.todayBillCollection)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(role === "ispOwner" ||
              (role === "collector" && !currentUser.collector.reseller)) && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-10 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("totalExpenditure")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <GraphDownArrow />
                      </p>
                      <h2>{FormatNumber(dashboardCard.totalExpenditure)}</h2>
                    </div>
                    {role === "ispOwner" && (
                      <p class="m-b-0">
                        {t("todayExpenditure")}
                        <span class="f-right">
                          {FormatNumber(dashboardCard.todayExpenditure)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {role === "manager" && permissions.dashboardCollectionData && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-13 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("collectorCollection")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <CashStack />
                      </p>
                      <h2>
                        {FormatNumber(dashboardCard.collectorsBillCollection)}
                      </h2>
                    </div>
                    <p class="m-b-0">
                      {t("todayCollection")}
                      <span class="f-right">
                        {FormatNumber(
                          dashboardCard.collectorsBillCollectionToday
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {role === "collector" && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-14 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("deposit")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <CashStack />
                      </p>
                      <h2>{FormatNumber(dashboardCard.totalDeposit)}</h2>
                    </div>
                    <p class="m-b-0">
                      {t("previousMonthDeposit")}
                      <span class="f-right">
                        {FormatNumber(dashboardCard.previousMonthDeposit)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {role === "ispOwner" && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-12 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("totalSalary")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <CashStack />
                      </p>
                      <h2>{FormatNumber(dashboardCard.totalSalary)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {role === "ispOwner" && (
              <div class="col-md-4 col-xl-3">
                <div class="card bg-card-15 order-card">
                  <div class="card-block display_card">
                    <p class="m-b-20">{t("businessBalance")}</p>
                    <div class="d-flex align-items-center">
                      <p className="card_Icon">
                        <GraphUpArrow />
                      </p>
                      <h2>{FormatNumber(dashboardCard.balance)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* dashboard over view card data end */}
      </div>

      {/* admin card data start */}
      {cardRole === "adminCard" && (
        <div class="row dashboard_card">
          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-17 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("totalCollection")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <FileEarmarkBarGraph />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.billCollection)
                    )}
                  </h2>
                </div>
                <p class="m-b-0">
                  {t("todayCollection")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.billCollectionToday)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-18 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("connectionFee")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Diagram2 />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.monthlyConnectionFee)
                    )}
                  </h2>
                </div>
                <p class="m-b-0">
                  {t("todayConnectionFee")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.todayConnectionFee)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-19 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("ownCost")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <GraphDown />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.expenditure)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-20 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("totalDiscount")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">%</p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.monthlyDiscount)
                    )}
                  </h2>
                </div>
                <p class="m-b-0">
                  {t("todayDiscount")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.todayBillDiscount)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-21 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("salary")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <CashStack />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.salary)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-22 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("depositCollection")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Cash />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.managerDeposit)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-23 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("ownBalance")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Wallet />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.ownBalance)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-24 order-card">
              <div className="d-flex align-items-center">
                <div class="card-block display_card">
                  <p class="m-b-20">{t("message")}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <p className="card_Icon">
                      <EnvelopePlus />
                    </p>
                  </div>
                </div>
                {isLoading ? (
                  <DotLoder />
                ) : (
                  <div className="mt-4">
                    <p class="m-b-0">
                      {t("masking")}
                      <span class="f-right ms-4">
                        {FormatNumber(dashboardCard.masking)}
                      </span>
                    </p>
                    <p class="m-b-0">
                      {t("nonMasking")}
                      <span class="f-right ms-4">
                        {FormatNumber(dashboardCard.nonMasking)}
                      </span>
                    </p>
                    <p class="m-b-0">
                      {t("fixedNumber")}
                      <span class="f-right ms-4">
                        {FormatNumber(dashboardCard.fixedNumber)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* admin card data end */}

      {/* manager card data start */}
      {cardRole === "managerCard" && (
        <div class="row dashboard_card">
          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-25 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("allManager")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <People />
                  </p>
                  <h2
                    className={adminUser && "clickable"}
                    onClick={() => adminUser && modlaClickHandler("manager")}
                  >
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.managerCounts)
                    )}
                  </h2>
                  &nbsp; &nbsp;
                  <span className="total_collection_amount">
                    ৳{FormatNumber(dashboardCard.totalMonthlyCollection)}
                  </span>
                </div>
                <p class="m-b-0">
                  {t("todayCollection")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.totalBillCollectionToday)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-26 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("connectionFee")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Diagram2 />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.connectionFee)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-27 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("depositCollection")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <CashStack />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.collectionDeposit)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-28 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("deposit")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Cash />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.deposit)
                    )}
                  </h2>
                </div>
                <p class="m-b-0">
                  {t("todayDeposit")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.todayDeposit)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-20 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("totalDiscount")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">%</p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.monthlyDiscount)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-29 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("totalExpenditure")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <GraphDown />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.expenditure)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-30 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("staffSalary")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Cash />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.staffSalary)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-31 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("balance")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Wallet />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.balance)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* manager card data end */}

      {/* collector card data start */}
      {cardRole === "collectorCard" && (
        <div class="row dashboard_card">
          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-32 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("allCollector")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <People />
                  </p>
                  <h2
                    className={adminUser && "clickable"}
                    onClick={() => adminUser && modlaClickHandler("collector")}
                  >
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.collectors)
                    )}
                  </h2>
                  &nbsp; &nbsp;
                  <span className="total_collection_amount">
                    ৳{FormatNumber(dashboardCard.billCollection)}
                  </span>
                </div>
                <p class="m-b-0">
                  {t("todayCollection")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.todayBillCollection)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-33 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("connectionFee")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Diagram2 />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.connectionFee)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-34 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("deposit")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Cash />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.deposit)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-30 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("cost")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <GraphDown />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.expenditure)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-35 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("balance")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Wallet />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.balance)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* manager card data end */}

      {/* collector card data start */}
      {cardRole === "resellerCard" && (
        <div class="row dashboard_card">
          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-36 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("allReseller")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <People />
                  </p>
                  <h2
                    className={adminUser && "clickable"}
                    onClick={() => adminUser && modlaClickHandler("reseller")}
                  >
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.resellers)
                    )}
                  </h2>
                  &nbsp; &nbsp;
                  <span className="total_collection_amount">
                    ৳{FormatNumber(dashboardCard.billCollection)}
                  </span>
                </div>
                <p class="m-b-0">
                  {t("todayCollection")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.todayBillCollection)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* collector card data end */}

      {/* manager dashboard below card data start */}
      {cardRole === "managerBelowCard" && (
        <div class="row dashboard_card">
          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-32 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("totalCollection")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Reception3 />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.monthlyBillCollection)
                    )}
                  </h2>
                </div>
                <p class="m-b-0">
                  {t("todayCollection")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.totalOwnCollectionToday)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-20 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("connectionFee")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Diagram2 />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.totalOwnMonthlyConnectionFee)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-33 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("depositCollection")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <CashStack />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.totalDepositByCollectors)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-34 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("deposit")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Cash />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.totalManagerDeposit)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-25 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("staffSalary")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Cash />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.managerStaffSalarySum)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-30 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("cost")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <GraphDown />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.managerExpenditure)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-26 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("discount")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">%</p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.monthlyBillDiscount)
                    )}
                  </h2>
                </div>
                <p class="m-b-0">
                  {t("todayDiscount")}
                  <span class="f-right">
                    {FormatNumber(dashboardCard.todayBillDiscount)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-xl-3">
            <div class="card bg-card-35 order-card">
              <div class="card-block display_card">
                <p class="m-b-20">{t("balance")}</p>
                <div class="d-flex align-items-center">
                  <p className="card_Icon">
                    <Wallet />
                  </p>
                  <h2>
                    {isLoading ? (
                      <DotLoder />
                    ) : (
                      FormatNumber(dashboardCard.balance)
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* manager dashboard below card data end */}

      {/* dashboard modal */}

      {/* all active customers modal */}
      {status === "active" && (
        <Active
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* all active customers modal */}
      {status === "inactive" && (
        <Inactive
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* all expired customers modal */}
      {status === "expired" && (
        <Expired
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* all paid customers modal */}
      {status === "paid" && (
        <Paid
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* all unpaid customers modal */}
      {status === "unpaid" && (
        <Unpaid
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* owner free customer modal */}
      {status === "freeCustomer" && (
        <FreeCustomer
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}
      {status === "discount" && (
        <Discount
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {status === "manager" && (
        <AllManager
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {status === "collector" && (
        <AllCollector
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          month={filterDate.getMonth() + 1}
          year={filterDate.getFullYear()}
          status={status}
        />
      )}

      {status === "reseller" && (
        <Reseller
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}
    </>
  );
};

export default DashboardCard;
