import React, { useEffect, useRef, useState } from "react";
import {
  ThreeDots,
  PlusCircleDotted,
  PlusCircleFill,
  Tools,
  PrinterFill,
  ArrowClockwise,
  ArchiveFill,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "../collector/collector.css";
import "./expenditure.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";

import {
  deleteExpenditure,
  getAllExpenditure,
  getExpenditureSectors,
} from "../../features/apiCalls";
import CreateExpenditure from "./CreateExpenditure";
import CreatePourpose from "./Createpourpose";
import moment from "moment";
import EditExpenditure from "./ExpenditureEdit";
import EditPourpose from "./EditPourpose";
import PrintExpenditure from "./expenditurePDF";
import ReactToPrint from "react-to-print";
import Table from "../../components/table/Table";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";

export default function Expenditure() {
  const { t } = useTranslation();
  const componentRef = useRef();
  const dispatch = useDispatch();

  // get ispOwner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get expenditure
  const expenditures = useSelector(
    (state) => state.expenditure.allExpenditures
  );

  // get expenditure purpose
  const expenditurePurpose = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );

  // get current date
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // set time
  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // get user data
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // expenditure state
  let [allExpenditures, setAllExpenditure] = useState([]);

  // single expenditure state
  const [singleExp, setSingleExp] = useState({});

  // single expenditure purpose state
  const [singlePurpose, setSinglePurpose] = useState({});

  // loading state
  const [isLoading, setIsloading] = useState(false);
  const [expenditureLoading, setExpenditureLoading] = useState(false);

  // start date state
  const [dateStart, setStartDate] = useState(firstDay);

  // end date state
  const [dateEnd, setEndDate] = useState(today);

  // filter value state
  const [filterOptions, setFilterOption] = useState({
    name: "",
    expenditurePurpose: "",
  });

  // set initial expenditure by current month
  useEffect(() => {
    var initialToday = new Date();
    var initialFirst = new Date(
      initialToday.getFullYear(),
      initialToday.getMonth(),
      1
    );

    initialFirst.setHours(0, 0, 0, 0);
    initialToday.setHours(23, 59, 59, 999);
    setAllExpenditure(
      expenditures.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [expenditures]);

  // delete expenditure
  const deleteExpenditureHandler = (expenditureId) => {
    const confirm = window.confirm(t("areYouSureWantToDelete"));
    if (confirm) {
      deleteExpenditure(dispatch, expenditureId);
    }
  };

  // reload handler
  const reloadHandler = () => {
    getAllExpenditure(dispatch, ispOwnerId, setExpenditureLoading);
    getExpenditureSectors(dispatch, ispOwnerId, setIsloading);
  };

  // find expenditure purpose method
  const findExpenditureType = (expenditureTypeId) => {
    const matchExpenditure = expenditurePurpose.find(
      (item) => item.id === expenditureTypeId
    );
    return matchExpenditure?.name;
  };

  // api call
  useEffect(() => {
    getOwnerUsers(dispatch, ispOwnerId);
    if (expenditures.length === 0)
      getAllExpenditure(dispatch, ispOwnerId, setExpenditureLoading);
    if (expenditurePurpose.length === 0)
      getExpenditureSectors(dispatch, ispOwnerId, setIsloading);
  }, []);

  // expenditure table column
  const expenditureColumns = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: t("expenseSector"),
        accessor: "expenditurePurpose",
        Cell: ({ cell: { value } }) => <div>{findExpenditureType(value)}</div>,
      },
      {
        width: "23%",
        Header: t("expenseDefination"),
        accessor: "description",
      },
      {
        Header: t("nam"),
        width: "20%",
        accessor: "user",
        Cell: ({ cell: { value } }) => {
          const performer = ownerUsers.find((item) => item[value]);

          return (
            <div>
              {performer &&
                performer[value].name + "(" + performer[value].role + ")"}
            </div>
          );
        },
      },
      {
        width: "10%",
        Header: t("amount"),
        accessor: "amount",
      },

      {
        width: "12%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
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
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu" aria-labelledby="customerDrop">
              {((role.match("collector") &&
                original.user.match(userData.user)) ||
                role !== "collector") && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#editExpenditure"
                  onClick={() => {
                    setSingleExp(original);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <Tools />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
              )}
              {role === "ispOwner" &&
                bpSettings.expenditureDelete &&
                new Date(original.createdAt).getMonth() ===
                  new Date().getMonth() && (
                  <li
                    onClick={() => {
                      deleteExpenditureHandler(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP">{t("delete")}</p>
                      </div>
                    </div>
                  </li>
                )}
            </ul>
          </div>
        ),
      },
    ],
    [ownerUsers, expenditurePurpose, t]
  );

  // expenditure purpose table column
  const expenditurePurposeColumns = React.useMemo(
    () => [
      {
        width: "20%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "30%",
        Header: t("expenseSector"),
        accessor: "name",
      },

      {
        width: "30%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },

      {
        width: "20%",
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
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                {role !== "collector" && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#editPurpose"
                    onClick={() => {
                      setSinglePurpose(original);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <Tools />
                        <p className="actionP">{t("edit")}</p>
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

  // onclick filter function
  const onClickFilter = () => {
    let expenditureValue = [...expenditures];

    if (filterOptions.name && filterOptions.name !== "Select") {
      expenditureValue = expenditureValue.filter(
        (item) => item?.user === filterOptions.name
      );
    }

    if (
      filterOptions.expenditurePurpose &&
      filterOptions.expenditurePurpose != "Select"
    ) {
      expenditureValue = expenditureValue.filter(
        (item) => item?.expenditurePurpose === filterOptions.expenditurePurpose
      );
    }

    expenditureValue = expenditureValue.filter(
      (original) =>
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(dateStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(dateEnd).format("YYYY-MM-DD")).getTime()
    );
    setAllExpenditure(expenditureValue);
  };

  // find filter user name
  const getFilterId = ownerUsers.find((item) => item[filterOptions.name]);

  let getFilterName;
  if (getFilterId) {
    getFilterName = getFilterId[filterOptions.name];
  }

  // find filter expenditure type
  let expenditureName;
  if (
    filterOptions.expenditurePurpose &&
    filterOptions.expenditurePurpose != "Select"
  ) {
    const expenditureType = expenditurePurpose.find(
      (item) => item.id === filterOptions.expenditurePurpose
    );
    expenditureName = expenditureType?.name;
  }

  // filter data
  const filterData = {
    name: getFilterName ? getFilterName?.name : t("all"),
    expenditureType: expenditureName ? expenditureName : t("all"),
    totalAmount: allExpenditures.reduce(
      (prev, current) => prev + current.amount,
      0
    ),
  };

  // sum of toata expenditure
  const getTotalExpenditure = () => {
    const total = allExpenditures.reduce((pre, curr) => pre + curr.amount, 0);
    return total;
  };

  // send total expenditure value in table header
  const customComponent = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {role === "ispOwner" ? (
        <div>
          {t("totalExpenditure")} {FormatNumber(getTotalExpenditure())}{" "}
          {t("tk")}
        </div>
      ) : (
        <div style={{ marginRight: "10px" }}>
          {t("totalExpenditure")} {FormatNumber(getTotalExpenditure())}{" "}
          {t("tk")}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Sidebar />

      {/* import modal  */}
      <CreateExpenditure />
      <CreatePourpose />
      <EditExpenditure singleExp={singleExp} />
      <EditPourpose singlePurpose={singlePurpose} />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <div className="collectorTitle d-flex justify-content-between px-5">
                <div className="d-flex">
                  <div>{t("expense")}</div>
                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise
                        onClick={() => reloadHandler()}
                      ></ArrowClockwise>
                    )}
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <>
                    <div title={t("addExpense")}>
                      <PlusCircleDotted
                        className="addcutmButton"
                        data-bs-toggle="modal"
                        data-bs-target="#createExpenditure"
                      />
                    </div>
                    {role !== "collector" && (
                      <div title={t("addExpenseSector")}>
                        <PlusCircleFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#createPourpose"
                        />
                      </div>
                    )}
                    <div title={t("print")}>
                      <ReactToPrint
                        documentTitle={t("expenseReport")}
                        trigger={() => (
                          <PrinterFill
                            title={t("print")}
                            className="addcutmButton"
                          />
                        )}
                        content={() => componentRef.current}
                      />
                    </div>
                  </>
                </div>
              </div>
              <FourGround>
                {/* print report */}
                <div style={{ display: "none" }}>
                  <PrintExpenditure
                    filterData={filterData}
                    ref={componentRef}
                    allExpenditures={allExpenditures}
                  />
                </div>
                {/* </div> */}

                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <Tabs
                      defaultActiveKey="expenditure"
                      id="uncontrolled-tab-example"
                      className=" mt-1"
                    >
                      <Tab eventKey="expenditure" title={t("expense")}>
                        <div className="nameFilter d-flex justify-content-center">
                          {role !== "collector" && (
                            <select
                              class="form-select"
                              aria-label="Default select example"
                              onChange={(event) =>
                                setFilterOption({
                                  ...filterOptions,
                                  name: event.target.value,
                                })
                              }
                            >
                              <option value="Select" selected>
                                {t("name")}
                              </option>
                              {ownerUsers.map((item) => {
                                for (const key in item) {
                                  return (
                                    (item[key].role === "manager" ||
                                      item[key].role === "ispOwner") && (
                                      <option value={key}>
                                        {item[key].name}
                                      </option>
                                    )
                                  );
                                }
                              })}
                            </select>
                          )}

                          <select
                            className="form-select ms-2"
                            aria-label="Default select example"
                            onChange={(event) =>
                              setFilterOption({
                                ...filterOptions,
                                expenditurePurpose: event.target.value,
                              })
                            }
                          >
                            <option value="Select" selected>
                              {t("expenseSector")}
                            </option>
                            {expenditurePurpose.map((item, key) => (
                              <option value={item?.id}>{item?.name}</option>
                            ))}
                          </select>
                          <div style={{ margin: "0 5px" }} className="dateDiv">
                            <input
                              className="form-select"
                              type="date"
                              id="start"
                              name="trip-start"
                              value={moment(dateStart).format("YYYY-MM-DD")}
                              onChange={(e) => {
                                setStartDate(e.target.value);
                              }}
                            />
                          </div>
                          <div style={{ margin: "0 5px" }} className="dateDiv">
                            <input
                              className="form-select"
                              type="date"
                              id="end"
                              name="trip-start"
                              value={moment(dateEnd).format("YYYY-MM-DD")}
                              onChange={(e) => {
                                setEndDate(e.target.value);
                              }}
                            />
                          </div>
                          <div>
                            <button
                              className="btn btn-outline-primary w-140 mt-2"
                              type="button"
                              onClick={onClickFilter}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </div>
                        <div className="table-section">
                          <Table
                            isLoading={expenditureLoading}
                            customComponent={customComponent}
                            data={allExpenditures.reverse()}
                            columns={expenditureColumns}
                          ></Table>
                        </div>
                      </Tab>
                      {role !== "collector" && (
                        <Tab
                          eventKey="expenditurePurpose"
                          title={t("expenseSector")}
                        >
                          <div className="table-section">
                            <Table
                              isLoading={isLoading}
                              data={expenditurePurpose}
                              columns={expenditurePurposeColumns}
                            ></Table>
                          </div>
                        </Tab>
                      )}
                    </Tabs>
                  </div>
                </div>
              </FourGround>
            </FontColor>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
