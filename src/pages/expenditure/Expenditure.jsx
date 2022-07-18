import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ThreeDots,
  PlusCircleDotted,
  PlusCircleFill,
  Tools,
  PrinterFill,
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

export default function Expenditure() {
  const { t } = useTranslation();
  const [isLoading, setIsloading] = useState(false);
  const componentRef = useRef();
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const expenditures = useSelector(
    (state) => state.expenditure.allExpenditures
  );
  const expenditurePurpose = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );

  // get owner users
  const ownerUsers = useSelector(
    (state) => state?.persistedReducer?.ownerUsers?.ownerUser
  );

  const role = useSelector((state) => state.persistedReducer.auth.role);

  // pagination
  let [allExpenditures, setAllExpenditure] = useState(expenditures);
  const [filterName, setFilterName] = useState();

  const [singleExp, setSingleExp] = useState({});
  const [singlePurpose, setSinglePurpose] = useState({});

  //set the expenditurePurpose name to expenditure
  useLayoutEffect(() => {
    const temp = [];
    expenditures?.forEach((e) => {
      expenditurePurpose?.forEach((ep) => {
        if (ep.id === e.expenditurePurpose) {
          temp.push({
            ...e,
            expenditureName: ep.name,
          });
        }
        return temp;
      });
      return temp;
    });
    setAllExpenditure(temp);
  }, [expenditures, expenditurePurpose]);

  useEffect(() => {
    getOwnerUsers(dispatch, ispOwnerId);
    getAllExpenditure(dispatch, ispOwnerId, setIsloading);
    getExpenditureSectors(dispatch, ispOwnerId, setIsloading);
  }, [ispOwnerId, dispatch]);

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
        width: "20%",
        Header: t("expenseSector"),
        accessor: "expenditureName",
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
            </ul>
          </div>
        ),
      },
    ],
    [ownerUsers, t]
  );
  const columns2 = React.useMemo(
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
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  const findName = (userId) => {
    const findId = ownerUsers.find((item) => item[userId]);
    return findId[userId].name;
  };

  if (filterName && filterName != "Select") {
    allExpenditures = allExpenditures.filter(
      (item) => item?.user === filterName
    );
  }

  const getTotalExpenditure = () => {
    const total = allExpenditures.reduce((pre, curr) => pre + curr.amount, 0);
    return total;
  };

  const customComponent = (
    <div style={{ fontSize: "20px", display: "flex", alignItems: "center" }}>
      {role === "ispOwner" ? (
        <div>
          {t("totalExpenditure")} {getTotalExpenditure()} {t("tk")}
        </div>
      ) : (
        <div style={{ marginRight: "10px" }}>
          {t("totalExpenditure")} {getTotalExpenditure()} {t("tk")}
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
                <div className="me-3"> {t("expense")} </div>
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
                    <div title={t("addExpenseSector")}>
                      <PlusCircleFill
                        className="addcutmButton"
                        data-bs-toggle="modal"
                        data-bs-target="#createPourpose"
                      />
                    </div>
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
                    ref={componentRef}
                    allExpenditures={allExpenditures}
                  />
                </div>
                {/* </div> */}

                <div className="collectorWrapper">
                  <div className="addCollector">
                    <Tabs
                      defaultActiveKey="expenditure"
                      id="uncontrolled-tab-example"
                      className=" mt-1"
                    >
                      <Tab eventKey="expenditure" title={t("expense")}>
                        <div className="nameFilter">
                          <select
                            class="form-select"
                            aria-label="Default select example"
                            onChange={(event) =>
                              setFilterName(event.target.value)
                            }
                          >
                            <option selected>Select</option>
                            {
                              ownerUsers.map((item) => {
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
                              })

                              // allExpenditures.map(
                              //   (item) =>
                              //     item.user && (
                              // <option value={item?.user}>
                              //   {findName(item?.user)}
                              // </option>
                              //     )
                              // )
                            }
                          </select>
                        </div>
                        <div className="table-section">
                          <Table
                            isLoading={isLoading}
                            customComponent={customComponent}
                            data={allExpenditures}
                            columns={columns}
                          ></Table>
                        </div>
                      </Tab>

                      <Tab
                        eventKey="expenditurePurpose"
                        title={t("expenseSector")}
                      >
                        <div className="table-section">
                          <Table
                            isLoading={isLoading}
                            data={expenditurePurpose}
                            columns={columns2}
                          ></Table>
                        </div>
                      </Tab>
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
