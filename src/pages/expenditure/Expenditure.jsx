import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PersonFill,
  PenFill,
  GearFill,
  PlusCircleDotted,
  PlusCircleFill,
  GearWide,
  Tools,
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
// import Loader from "../../components/common/Loader";
import Pagination from "../../components/Pagination";

import TdLoader from "../../components/common/TdLoader";

import {
  getAllExpenditure,
  getCollector,
  getExpenditureSectors,
} from "../../features/apiCalls";
import CreateExpenditure from "./CreateExpenditure";
import CreatePourpose from "./Createpourpose";
import moment from "moment";
import EditExpenditure from "./ExpenditureEdit";
import EditPourpose from "./EditPourpose";
import Table from "../../components/table/Table";

export default function Expenditure() {
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const [collSearch, setCollSearch] = useState("");
  const expenditures = useSelector(
    (state) => state.expenditure.allExpenditures
  );
  const expenditurePurpose = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );

  let serial = 0;
  let seriall = 0;
  // pagination
  const [initialExp, setInitialExp] = useState(expenditures);
  const [currentPage, setCurrentPage] = useState(1);
  const [expenditurePage, setExpenditurePage] = useState(5);
  const [singleExp, setSingleExp] = useState({});
  const [singlePurpose, setSinglePurpose] = useState({});
  const lastIndex = currentPage * expenditurePage;
  const [purpose, setPurpose] = useState(expenditurePurpose);
  const firstIndex = lastIndex - expenditurePage;
  const currentExpenditure = initialExp.slice(firstIndex, lastIndex);
  const [allExpenditures, setallExpenditure] = useState(currentExpenditure);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );
  const role = useSelector((state) => state.persistedReducer.auth.role);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useLayoutEffect(() => {
    setPurpose(expenditurePurpose);
    const temp = [];
    expenditures?.map((e) => {
      expenditurePurpose?.map((ep) => {
        if (ep.id === e.expenditurePurpose) {
          // console.log({ ...e, namee: ep.name });
          temp.push({
            ...e,
            expenditureName: ep.name,
          });
        }
        return temp;
      });
      return temp;
    });
    // console.log(temp);
    setInitialExp(temp);
  }, [expenditures, expenditurePurpose]);
  useEffect(() => {
    getAllExpenditure(dispatch, ispOwnerId);
    getExpenditureSectors(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch]);

  useEffect(() => {
    const keys = ["amount", "expenditureName", "createdAt"];
    if (collSearch !== "") {
      setallExpenditure(
        initialExp?.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key].toString().toLowerCase().includes(collSearch)
              : item[key].toString().includes(collSearch)
          )
        )
      );
    } else {
      setallExpenditure(initialExp);
    }
  }, [collSearch, initialExp]);

  const searchPurpose = (e) => {
    const keys = ["name"];
    if (e !== "") {
      setPurpose(
        expenditurePurpose?.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key].toString().toLowerCase().includes(e)
              : item[key].toString().includes(e)
          )
        )
      );
    } else {
      setPurpose(expenditurePurpose);
    }
  };

  const searchHandler = (e) => {
    setCollSearch(e.toString().toLowerCase());
  };

  const getTotalExpenditure = () => {
    const total = allExpenditures.reduce((pre, curr) => pre + curr.amount, 0);
    return total;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "খরচের খাত",
        accessor: "expenditureName",
      },
      {
        Header: "পরিমান",
        accessor: "amount",
      },

      {
        Header: "তারিখ",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },

      {
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { val } }) => (
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
                  setSingleExp(val);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <Tools />
                    <p className="actionP">এডিট</p>
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
  const columns2 = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "খরচের খাত",
        accessor: "name",
      },

      {
        Header: "তারিখ",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },

      {
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { val } }) => (
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
                data-bs-target="#editPurpose"
                onClick={() => {
                  setSinglePurpose(val);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <Tools />
                    <p className="actionP">এডিট</p>
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
  const customComponent = (
    <div style={{ fontSize: "20px", display: "flex", alignItems: "center" }}>
      {role === "ispOwner" ? (
        <div>মোট খরচ {getTotalExpenditure()} টাকা</div>
      ) : (
        <div style={{ marginRight: "10px" }}>
          মোট খরচ {getTotalExpenditure()} টাকা
        </div>
      )}
    </div>
  );

  return (
    <>
      <CreateExpenditure></CreateExpenditure>
      <CreatePourpose></CreatePourpose>
      <EditExpenditure singleExp={singleExp}></EditExpenditure>
      <EditPourpose singlePurpose={singlePurpose}></EditPourpose>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <h2 className="collectorTitle">খরচ</h2>

              {/* modals */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <div className="displexFlexSys">
                        <div
                          style={{ display: "flex" }}
                          className="addAndSettingIcon"
                        >
                          <div title="খরচ অ্যাড ">
                            <PlusCircleDotted
                              className="addcutmButton"
                              data-bs-toggle="modal"
                              data-bs-target="#createExpenditure"
                            />
                          </div>

                          <div title="খরচের খাত অ্যাড">
                            <PlusCircleFill
                              className="addcutmButton"
                              data-bs-toggle="modal"
                              data-bs-target="#createPourpose"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* table */}
                  <Table
                    customComponent={customComponent}
                    data={allExpenditures}
                    columns={columns}
                  ></Table>
                  <Table data={purpose} columns={columns2}></Table>
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
