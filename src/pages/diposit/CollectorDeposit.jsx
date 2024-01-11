import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, Tab, Tabs } from "react-bootstrap";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import * as Yup from "yup";
import moment from "moment";
import { FilterCircle } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";

// internal import
import "./diposit.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import Table from "../../components/table/Table";
import {
  addDeposit,
  collectorAllPrevBalance,
  getMultipleManager,
  getMyDeposit,
  getTotalbal,
} from "../../features/apiCalls";
import Footer from "../../components/admin/footer/Footer";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import PrevBalanceDeposit from "./PrevBalanceDeposit";
import { badge } from "../../components/common/Utils";
import FormatNumber from "../../components/common/NumberFormat";
import NoteDetailsModal from "./NoteDetailsModal";

const CollectorDeposit = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // current month date
  let date = new Date();
  var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);

  firstDate.setHours(0, 0, 0, 0);
  date.setHours(23, 59, 59, 999);

  // add deposit form validation
  const depositValidation = Yup.object().shape({
    amount: Yup.string()
      .min(3, t("minAmount"))
      .required("Please insert amount."),
  });

  // get user data form redux
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  // get manager from redux
  const manager = useSelector((state) => state?.manager?.multipleManager);

  // get balance from redux
  const balance = useSelector((state) => state?.payment?.balance);

  // get own deposit from redux
  let ownDeposits = useSelector((state) => state?.payment?.myDeposit);

  // collector all previous balance
  const allPrevBalance = useSelector((state) => state?.collector?.prevBalance);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  // tabs change event key
  const [tabEventKey, setTabEventKey] = useState("deposit");

  // select manager
  const [selectManager, setSelectManager] = useState("");

  // owner deposit data
  const [ownDepositData, setOwnDepositData] = useState([]);

  // previous balance deposit data
  const [depositData, setDepositData] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // own deposit report monthly filter
  const [ownFilter, setOwnFilter] = useState(firstDate);

  // manager message note
  const [message, setMessage] = useState("");

  // own deposit month start & end date
  const [ownDepositStart, setOwnDepositStart] = useState(firstDate);
  const [ownDepositEnd, setOwnDepositEnd] = useState(new Date());

  // current month start & end date
  var ownSelectDate = new Date(
    ownFilter.getFullYear(),
    ownFilter.getMonth(),
    1
  );
  var ownLastDate = new Date(
    ownFilter.getFullYear(),
    ownFilter.getMonth() + 1,
    0
  );

  useEffect(() => {
    if (tabEventKey === "deposit") {
      manager.length === 0 && getMultipleManager(dispatch, userData);
      getTotalbal(dispatch);
    }
    if (tabEventKey === "ownDeposit") {
      setOwnDepositStart(ownSelectDate);

      if (ownLastDate.getMonth() + 1 === date.getMonth() + 1) {
        setOwnDepositEnd(date);
      } else {
        setOwnDepositEnd(ownLastDate);
      }

      ownFilter.getMonth() + 1 &&
        getMyDeposit(
          dispatch,
          ownFilter.getFullYear(),
          ownFilter.getMonth() + 1,
          setIsLoading
        );
    }
    if (tabEventKey === "prevBalance") {
      allPrevBalance.length === 0 &&
        collectorAllPrevBalance(
          dispatch,
          userData?.collector?.id,
          setIsLoading
        );
    }
    tabEventKey &&
      Object.keys(butPermission)?.length === 0 &&
      getBulletinPermission(dispatch);
  }, [tabEventKey, ownFilter]);

  useEffect(() => {
    setOwnDepositData(ownDeposits);
  }, [ownDeposits]);

  // add bill deposit
  const collectorDeposit = (data) => {
    if (data.amount < 100) {
      toast.warn(t("minAmount"));
      return;
    }

    if (!selectManager) {
      toast.error(t("selectManager"));
      return;
    } else {
      const sendingData = {
        depositBy: userData?.user.role,
        amount: data.amount,
        balance: data.balance,
        user: userData?.user.id,
        ispOwner: userData?.collector.ispOwner,
        manager: selectManager,
        note: data.note,
      };
      addDeposit(dispatch, sendingData, setIsLoading);
      data.amount = "";
    }
  };

  // own deposit filter
  const ownDepositDateFilter = () => {
    let ownDeposit = [...ownDeposits];

    ownDeposit = ownDeposit.filter(
      (original) =>
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(ownDepositStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(ownDepositEnd).format("YYYY-MM-DD")).getTime()
    );

    setOwnDepositData(ownDeposit);
  };

  //function to calculate total Commissions and other amount
  const getTotalOwnDeposit = useCallback(() => {
    let collectionDeposit;
    let previousDeposit;

    // current month depostit filter
    collectionDeposit = ownDepositData.filter(
      (item) => item.status === "accepted" && !item.month
    );

    // previous month deposit filter
    previousDeposit = ownDepositData.filter(
      (item) => item.status === "accepted" && item.month
    );

    const initialValue = 0;

    // current month colleciton deposti
    const collectionDepositSum = collectionDeposit.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );

    // previous balance deposti
    const previousDepositSum = previousDeposit.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );

    return { collectionDepositSum, previousDepositSum };
  }, [ownDepositData]);

  // send sum own deposits of table
  const ownDepositSum = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {getTotalOwnDeposit()?.collectionDepositSum > 0 && (
        <div>
          {t("collectionDeposit")}: ৳
          {FormatNumber(getTotalOwnDeposit()?.collectionDepositSum)}
        </div>
      )}
      &nbsp; &nbsp;
      {getTotalOwnDeposit()?.previousDepositSum > 0 && (
        <div>
          {t("previousMonthDeposit")}: ৳
          {FormatNumber(getTotalOwnDeposit()?.previousDepositSum)}
        </div>
      )}
    </div>
  );

  // own deposit column
  const columns = useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "15%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "20%",
        Header: t("manager"),
        accessor: "manager.name",
      },
      {
        width: "15%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <div>
            {original.status === "accepted" && (
              <span className="badge bg-success">{t("managerAccepted")}</span>
            )}
            {original.status === "rejected" && (
              <span className="badge bg-danger">{t("managerCanceled")}</span>
            )}
            {original.status === "pending" && (
              <span className="badge bg-warning">{t("managerPending")}</span>
            )}
          </div>
        ),
      },
      {
        width: "20%",
        Header: t("note"),
        accessor: "note",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original?.note && original?.note?.slice(0, 70)}
              <span
                className="text-primary see-more"
                data-bs-toggle="modal"
                data-bs-target="#dipositNoteDetailsModal"
                onClick={() => setMessage(original?.note)}
              >
                {original?.note?.length > 70 ? "...see more" : ""}
              </span>
            </div>
          );
        },
      },
      {
        width: "20%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
    ],
    [t]
  );

  // previous balance
  const columns3 = useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "15%",
        Header: t("month"),
        accessor: "month",
      },

      {
        width: "15%",
        Header: t("year"),
        accessor: "year",
      },
      {
        width: "15%",
        Header: t("deposit"),
        accessor: "deposit",
      },
      {
        width: "15%",
        Header: t("billReport"),
        accessor: "billReport",
      },
      {
        width: "15%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "15%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",
        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            {original.status !== "" ? (
              badge(original.status)
            ) : (
              <button
                style={{ cursor: "pointer" }}
                className="btn btn-outline-primary"
                onClick={() => {
                  setDepositData(original);
                  setShow(true);
                }}
              >
                {t("deposit")}
              </button>
            )}
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("deposit")}</div>

                  <div className="d-flex justify-content-center align-items-center">
                    {tabEventKey === "ownDeposit" && (
                      <div
                        onClick={() => {
                          if (!activeKeys) {
                            setActiveKeys("filter");
                          } else {
                            setActiveKeys("");
                          }
                        }}
                        title={t("filter")}
                      >
                        <FilterCircle className="addcutmButton" />
                      </div>
                    )}
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <Tabs
                      defaultActiveKey="deposit"
                      id="uncontrolled-tab-example"
                      onSelect={(eventKey) => setTabEventKey(eventKey)}
                    >
                      <Tab eventKey="deposit" title={t("deposit")}>
                        <Formik
                          initialValues={{
                            amount: balance,
                            balance: balance, //put the value from api
                            note: "",
                          }}
                          validationSchema={depositValidation}
                          onSubmit={(values) => {
                            collectorDeposit(values);
                          }}
                          enableReinitialize
                        >
                          {() => (
                            <Form>
                              <div className="displayGrid4 mt-3">
                                <div>
                                  <label className="form-control-label changeLabelFontColor">
                                    {t("selectManager")}
                                  </label>
                                  <select
                                    className="form-select mt-0 mw-100"
                                    onChange={(e) =>
                                      setSelectManager(e.target.value)
                                    }
                                  >
                                    <option value="">
                                      {t("selectManager")}
                                    </option>
                                    {manager.map((value) => (
                                      <option value={value.id}>
                                        {value.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <FtextField
                                  type="text"
                                  name="balance"
                                  label={t("totalBalance")}
                                  disabled
                                />

                                <FtextField
                                  type="text"
                                  name="amount"
                                  label={t("dipositAmount")}
                                />

                                <FtextField
                                  type="text"
                                  name="note"
                                  label={t("note")}
                                />
                              </div>
                              <div className="d-flex justify-content-center mt-4">
                                <button
                                  type="submit"
                                  className="btn btn-outline-primary w-140"
                                >
                                  {isLoading ? <Loader /> : t("submit")}
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </Tab>

                      <Tab eventKey="ownDeposit" title={t("ownDeposit")}>
                        <Accordion alwaysOpen activeKey={activeKeys}>
                          <Accordion.Item
                            eventKey="filter"
                            className="accordionBorder"
                          >
                            <Accordion.Body className="accordionPadding">
                              <div className="displayGrid6">
                                <div>
                                  <DatePicker
                                    className="form-control mw-100 mt-0"
                                    selected={ownFilter}
                                    onChange={(date) => setOwnFilter(date)}
                                    dateFormat="MMM-yyyy"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    maxDate={new Date()}
                                    minDate={
                                      new Date(
                                        new Date(userData.collector?.createdAt)
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <DatePicker
                                    className="form-control"
                                    selected={ownDepositStart}
                                    onChange={(date) =>
                                      setOwnDepositStart(date)
                                    }
                                    dateFormat="MMM dd yyyy"
                                    minDate={ownSelectDate}
                                    maxDate={
                                      ownLastDate.getMonth() + 1 ===
                                      date.getMonth() + 1
                                        ? date
                                        : ownLastDate
                                    }
                                    placeholderText={t("selectBillDate")}
                                  />
                                </div>

                                <div>
                                  <DatePicker
                                    className="form-control"
                                    selected={ownDepositEnd}
                                    onChange={(date) => setOwnDepositEnd(date)}
                                    dateFormat="MMM dd yyyy"
                                    minDate={ownSelectDate}
                                    maxDate={
                                      ownLastDate.getMonth() + 1 ===
                                      date.getMonth() + 1
                                        ? date
                                        : ownLastDate
                                    }
                                    placeholderText={t("selectBillDate")}
                                  />
                                </div>

                                <div className="submitDiv">
                                  <button
                                    className="btn btn-outline-primary w-140"
                                    type="button"
                                    onClick={ownDepositDateFilter}
                                  >
                                    {t("filter")}
                                  </button>
                                </div>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>

                        <div className="table-section">
                          <Table
                            customComponent={ownDepositSum}
                            data={ownDepositData}
                            columns={columns}
                            isLoading={isLoading}
                          ></Table>
                        </div>
                      </Tab>

                      <Tab eventKey="prevBalance" title={t("previousBalance")}>
                        <Table
                          isLoading={isLoading}
                          columns={columns3}
                          data={allPrevBalance}
                        ></Table>
                      </Tab>
                    </Tabs>
                  </div>
                </div>

                {(butPermission?.deposit || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* previous balance deposit in manager */}
      <PrevBalanceDeposit
        show={show}
        setShow={setShow}
        depositData={depositData}
      />

      {/* modals */}
      <NoteDetailsModal message={message} />
    </>
  );
};

export default CollectorDeposit;
