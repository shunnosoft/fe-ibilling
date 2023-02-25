import { useEffect, useState, useMemo } from "react";
import {
  ThreeDots,
  PenFill,
  ArchiveFill,
  ArrowLeftShort,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

// internal imports
import useDash from "../../../assets/css/dash.module.css";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../../assets/js/theme";
import Footer from "../../../components/admin/footer/Footer";
import StaffSalaryPostModal from "./StaffSalaryPostModal";
import { getSalaryApi, getStaffs } from "../../../features/apiCallStaff";
import Table from "../../../components/table/Table";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { getMonth } from "../../../components/common/getMonth";
import SalaryDeleteModal from "./SalaryDeleteModal";
import { getOwnerUsers } from "../../../features/getIspOwnerUsersApi";

export default function StaffSalary() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { staffId } = useParams();

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const userRole = useSelector((state) => state.persistedReducer.auth?.role);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  const staff = useSelector((state) =>
    state.staff.staff.find((item) => item.id == staffId)
  );

  const getSalaries = useSelector((state) => state.staff?.salary);

  const [salaryId, setSalaryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSalaryApi(dispatch, staffId, setIsLoading);
    getStaffs(dispatch, ispOwner, setIsLoading);
    getOwnerUsers(dispatch, ispOwner);
  }, [staffId]);

  const columns = useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "12%",
        Header: t("year"),
        accessor: "year",
      },
      {
        width: "15%",
        Header: t("month"),
        accessor: "month",
        Cell: ({ cell: { value } }) => {
          return getMonth(value);
        },
      },
      {
        width: "12%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        Header: t("paySalary"),
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
        width: "20%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      {
        width: "10%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <>
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="resellerDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />

            <ul className="dropdown-menu" aria-labelledby="resellerDropdown">
              {new Date(original.createdAt).getMonth() ===
                new Date().getMonth() &&
                userRole === "ispOwner" && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#deleteSalaryModal"
                    onClick={() => {
                      setSalaryId(original.id);
                    }}
                  >
                    <div className="dropdown-item actionManager">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP">{t("delete")}</p>
                      </div>
                    </div>
                  </li>
                )}
            </ul>
          </>
        ),
      },
    ],
    [t, ownerUsers]
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
                <div className="collectorTitle d-flex justify-content-between align-item-center px-5 mb-2">
                  <div>
                    {/* <Link to="/staff">
                      <div className="AllMikrotik mt-1">
                        <ArrowLeftShort className="arrowLeftSize" />
                        <span style={{ marginLeft: "3px" }}>Back</span>
                      </div>
                    </Link> */}
                    <Link to="/staff">
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "#0EB96A",
                          color: "white",
                          padding: "1,0,1,0",
                        }}
                      >
                        <ArrowLeftShort className="arrowLeftSize" />
                        Back
                      </button>
                    </Link>
                    &nbsp; &nbsp;
                    <span>{t("staffProfile")}</span>
                  </div>
                  <Button
                    onClick={() => setSalaryId(staff.id)}
                    data-bs-toggle="modal"
                    data-bs-target="#addSalaryPostModal"
                    variant="success"
                    size="sm"
                  >
                    {t("paySalary")}
                  </Button>
                </div>
              </FourGround>
              {/* edit manager */}
              <FourGround>
                <div className="collectorWrapper pb-2">
                  <div className="addCollector d-flex justify-content-between">
                    {staff && (
                      <div className="ManagerData p-3">
                        <p>
                          <b>{staff.name} </b>, <b> {"address"}</b>
                        </p>
                        <p>
                          <b>{staff.mobile}</b>
                        </p>
                        <p>{staff.email}</p>
                      </div>
                    )}
                  </div>
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={getSalaries}
                    />
                  </div>

                  <StaffSalaryPostModal staffId={staffId} />
                  <SalaryDeleteModal salaryId={salaryId} />
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
