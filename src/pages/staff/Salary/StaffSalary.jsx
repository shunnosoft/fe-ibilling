import { useEffect, useState, useMemo } from "react";
import { ThreeDots, PenFill, ArchiveFill } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

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

export default function StaffSalary() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { staffId } = useParams();

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const staff = useSelector((state) =>
    state.staff.staff.find((item) => item.id == staffId)
  );

  const getSalaries = useSelector((state) => state.staff?.salary);

  const [salaryId, setSalaryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSalaryApi(dispatch, staffId, setIsLoading);
    getStaffs(dispatch, ispOwner, setIsLoading);
  }, [staffId]);

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
        width: "18%",
        Header: t("year"),
        accessor: "year",
      },
      {
        width: "18%",
        Header: t("month"),
        accessor: "month",
        Cell: ({ cell: { value } }) => {
          return getMonth(value);
        },
      },
      {
        width: "18%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "18%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      {
        width: "18%",
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
                new Date().getMonth() && (
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
                <div className="collectorTitle d-flex justify-content-between align-item-center px-5 mb-2">
                  <span>{t("staffProfile")}</span>
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
