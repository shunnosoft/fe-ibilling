import { useEffect, useState, useMemo } from "react";
import {
  ThreeDots,
  ArchiveFill,
  ArrowLeftShort,
  ArrowLeft,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();

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

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

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
        width: "10%",
        Header: t("year"),
        accessor: "year",
      },
      {
        width: "12%",
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
        width: "16%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "15%",
        Header: t("comment"),
        accessor: "remarks",
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
                    onClick={() => {
                      setSalaryId(original.id);
                      setModalStatus("delete");
                      setShow(true);
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
                  <div className="d-flex">
                    <div
                      className="pe-2 text-black"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="arrowLeftSize" />
                    </div>
                    <span>{t("staffProfile")}</span>
                  </div>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => {
                      setSalaryId(staff.id);
                      setModalStatus("paySalary");
                      setShow(true);
                    }}
                  >
                    <span className="fw-bold">৳</span> {t("paySalary")}
                  </button>
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
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      {/* employee salary modal */}
      {modalStatus === "paySalary" && (
        <StaffSalaryPostModal show={show} setShow={setShow} staffId={staffId} />
      )}

      {/* delete salary modal */}
      {modalStatus === "delete" && (
        <SalaryDeleteModal show={show} setShow={setShow} salaryId={salaryId} />
      )}
    </>
  );
}
