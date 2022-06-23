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

export default function Expenditure() {
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
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // pagination
  const [allExpenditures, setAllExpenditure] = useState(expenditures);
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
    getAllExpenditure(dispatch, ispOwnerId, setIsloading);
    getExpenditureSectors(dispatch, ispOwnerId, setIsloading);
  }, [ispOwnerId, dispatch]);

  const getTotalExpenditure = () => {
    const total = allExpenditures.reduce((pre, curr) => pre + curr.amount, 0);
    return total;
  };

  const columns = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "18%",
        Header: "খরচের খাত",
        accessor: "expenditureName",
      },
      {
        width: "18%",
        Header: "খরচের বিবরণ",
        accessor: "description",
      },
      {
        width: "18%",
        Header: "পরিমান",
        accessor: "amount",
      },

      {
        width: "21%",
        Header: "তারিখ",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },

      {
        width: "15%",
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
        width: "20%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "30%",
        Header: "খরচের খাত",
        accessor: "name",
      },

      {
        width: "30%",
        Header: "তারিখ",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },

      {
        width: "20%",
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
                <div className="me-3">খরচ</div>
                <div
                  className="d-flex"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <>
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
                    <div title="প্রিন্ট">
                      <ReactToPrint
                        documentTitle="খরচ রিপোর্ট"
                        trigger={() => (
                          <PrinterFill
                            title="প্রিন্ট "
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
                      <Tab eventKey="expenditure" title="খরচ">
                        <div className="table-section">
                          <Table
                            isLoading={isLoading}
                            customComponent={customComponent}
                            data={allExpenditures}
                            columns={columns}
                          ></Table>
                        </div>
                      </Tab>

                      <Tab eventKey="expenditurePurpose" title="খরচ খাত">
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
