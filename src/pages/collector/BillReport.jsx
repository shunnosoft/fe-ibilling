import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../assets/js/theme";
import useDash from "../../assets/css/dash.module.css";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/admin/footer/Footer";
import {
  getAllPackages,
  getCollector,
  getCollectorBillReport,
} from "../../features/apiCalls";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Table from "../../components/table/Table";
import useMikrotikPackage from "../../hooks/useMikrotikPackage";
import { ArrowClockwise, FilterCircle, ArrowLeft } from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { Accordion } from "react-bootstrap";

const monthsName = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

const BillReport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const { id: collectorId } = useParams();

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const singleCollector = useSelector(
    (state) => state?.collector?.collector
  ).find((col) => col.id === collectorId);

  const collectorReport = useSelector(
    (state) => state?.collector?.collectorReport
  );

  const [isLoading, setIsLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState();
  const [activeKeys, setActiveKeys] = useState("");

  //all dates states
  const date = new Date();
  const newYear = date.getFullYear();
  const initialMonth = Number(date.getMonth()) + 1;
  const [Year, setYear] = useState(newYear);
  const [Month, setMonth] = useState(initialMonth);

  const handleFilter = () => {
    getCollectorBillReport(collectorId, Year, Month, dispatch, setIsLoading);
  };

  useEffect(() => {
    getAllPackages(dispatch, ispOwnerId, setPackageLoading);
    getCollectorBillReport(
      collectorId,
      newYear,
      initialMonth,
      dispatch,
      setIsLoading
    );
    getCollector(dispatch, ispOwnerId, setIsLoading);
  }, [collectorId]);

  const columns = useMemo(
    () => [
      {
        width: "10%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "12%",
        Header: t("name"),
        accessor: "customer.name",
      },

      {
        width: "10%",
        Header: t("bill"),
        accessor: "amount",
      },
      {
        width: "10%",
        Header: t("discount"),
        accessor: "discount",
      },
      {
        width: "10%",
        Header: t("due"),
        accessor: "due",
      },
      {
        width: "12%",
        Header: t("agent"),
        accessor: "medium",
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "customer.mikrotikPackage",
        Cell: ({ cell: { value } }) => (
          <div>{useMikrotikPackage(value)?.name}</div>
        ),
      },
      {
        width: "15%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
    ],
    [t]
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluid collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex gap-2">
                    <ArrowLeft
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                      className="mt-1"
                    />
                    <h2>{singleCollector?.name}</h2>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
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
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="table-section">
                      <Accordion alwaysOpen activeKey={activeKeys}>
                        <Accordion.Item
                          eventKey="filter"
                          className="accordionBorder"
                        >
                          <Accordion.Body className="accordionPadding">
                            <div className="selectFilteringg">
                              <select
                                className="form-select chartFilteritem"
                                onChange={(e) => setYear(e.target.value)}
                              >
                                <option value={newYear}>{newYear}</option>
                                <option value={newYear - 1}>
                                  {newYear - 1}
                                </option>
                              </select>
                              <select
                                className="form-select chartFilteritem"
                                value={Month}
                                onChange={(e) => setMonth(e.target.value)}
                              >
                                {monthsName.map((val, index) => (
                                  <option value={Number(index) + 1} key={index}>
                                    {val.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="btn btn-outline-primary w-140 mt-2 chartFilteritem"
                                type="button"
                                onClick={handleFilter}
                              >
                                {isLoading ? <Loader /> : t("filter")}
                              </button>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={collectorReport}
                      ></Table>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
        {/* modals */}
      </div>
    </>
  );
};

export default BillReport;
