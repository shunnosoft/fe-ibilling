import { useEffect, useState, useMemo } from "react";
import {
  ThreeDots,
  PenFill,
  ArchiveFill,
  CurrencyDollar,
} from "react-bootstrap-icons";
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
import StaffSalaryEditModal from "./StaffSalaryEditModal";
import { getSalaryApi } from "../../../features/apiCallStaff";
import Table from "../../../components/table/Table";
import { useTranslation } from "react-i18next";

export default function StaffSalary() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { staffId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );
  const staff = useSelector((state) =>
    state.persistedReducer.staff.staff.find((item) => item.id == staffId)
  );

  const getSalaries = useSelector(
    (state) => state.persistedReducer.staff?.salary
  );

  const [salaryId, setSalaryId] = useState(null);
  //editHandler
  const editHandler = (id) => {
    // console.log(id);
    setSalaryId(id);
  };

  useEffect(() => {
    getSalaryApi(dispatch, staffId);
  }, [staffId]);

  const columns = useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "বছর",
        accessor: "year",
      },
      {
        Header: "মাস",
        accessor: "month",
      },
      {
        Header: "পরিমাণ",
        accessor: "amount",
      },
      {
        Header: "বকেয়া",
        accessor: "due",
      },

      {
        Header: () => <div className="text-center">অ্যাকশন</div>,
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
              <li
                data-bs-toggle="modal"
                data-bs-target="#editSalaryPostModal"
                onClick={() => {
                  editHandler(original.id);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <PenFill />
                    <p className="actionP">এডিট</p>
                  </div>
                </div>
              </li>
              <li
              // onClick={() => {
              //   deleteStaff(data.id);
              // }}
              >
                <div className="dropdown-item actionManager">
                  <div className="customerAction">
                    <ArchiveFill />
                    <p className="actionP">ডিলিট</p>
                  </div>
                </div>
              </li>
            </ul>
          </>
        ),
      },
    ],
    []
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
                <h2 className="collectorTitle">
                  ({staff?.name}) {t("staffProfile")}
                </h2>
              </FourGround>
              {/* edit manager */}
              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector d-flex justify-content-between">
                    {staff && (
                      <div className="ManagerData">
                        <p>
                          <b>{staff.name} </b>, <b> {"address"}</b>
                        </p>
                        <p>
                          <b>{staff.mobile}</b>
                        </p>
                        <p>{staff.email}</p>
                      </div>
                    )}

                    {staff && (
                      <Button
                        data-bs-toggle="modal"
                        data-bs-target="#addSalaryPostModal"
                        style={{ height: "50px" }}
                        variant="primary"
                      >
                        {t("paySalary")}
                      </Button>
                    )}
                  </div>
                  {getSalaries.length > 0 ? (
                    <Table columns={columns} data={getSalaries} />
                  ) : (
                    "No Record to show"
                  )}
                  <StaffSalaryPostModal staffId={staffId} />
                  <StaffSalaryEditModal salaryId={salaryId} />
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
