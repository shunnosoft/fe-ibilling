import React, { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import {
  ArrowClockwise,
  ChatText,
  CurrencyDollar,
  PenFill,
  PersonPlusFill,
  PrinterFill,
  ThreeDots,
  Trash,
} from "react-bootstrap-icons";

// custom hooks
import useISPowner from "../../hooks/useISPOwner";

//internal import
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import StaffPost from "./staffModal/staffPost";
import { getStaffs } from "../../features/apiCallStaff";
import StaffEdit from "./staffModal/staffEdit";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import { badge } from "../../components/common/Utils";
import StaffDelete from "./staffModal/StaffDelete";
import StaffPdf from "./StaffPdf";

const Staff = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId } = useISPowner();

  const getAllStaffs = useSelector((state) => state?.staff?.staff);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // staff id state
  const [staffId, setStafId] = useState("");
  const [staffSmsId, setStafSmsId] = useState();

  // modal handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getAllStaffs.length === 0)
      getStaffs(dispatch, ispOwnerId, setIsLoading);
  }, []);

  // reload handler
  const reloadHandler = () => {
    getStaffs(dispatch, ispOwnerId, setIsLoading);
  };

  //create column of table
  const columns = useMemo(
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
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "20%",
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "20%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "20%",
        Header: t("salary"),
        accessor: "salary",
      },
      {
        width: "20%",
        Header: t("due"),
        accessor: "due",
      },
      {
        width: "12%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",
        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="resellerDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu" aria-labelledby="resellerDropdown">
              {role === "ispOwner" && (
                <li
                  onClick={() => {
                    setStafId(original.id);
                    setModalStatus("edit");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP"> {t("edit")} </p>
                    </div>
                  </div>
                </li>
              )}

              <Link to={"/staff/" + original.id}>
                <li>
                  <div className="dropdown-item actionManager">
                    <div className="customerAction">
                      <CurrencyDollar />
                      <p className="actionP"> {t("salary")} </p>
                    </div>
                  </div>
                </li>
              </Link>

              {original.mobile && (
                <li
                  onClick={() => {
                    setStafSmsId(original.id);
                    setModalStatus("message");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ChatText />
                      <p className="actionP"> {t("message")} </p>
                    </div>
                  </div>
                </li>
              )}

              {/* {role === "ispOwner" && (
                <li
                  onClick={() => {
                    setStafId(original.id);
                    setModalStatus("delete");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <Trash />
                      <p className="actionP"> {t("delete")} </p>
                    </div>
                  </div>
                </li>
              )} */}
            </ul>
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
        <div className="container">
          <FontColor>
            <FourGround>
              <div className="collectorTitle d-flex justify-content-between px-4">
                <div className="component_name">{t("staff")}</div>

                <div className="d-flex justify-content-center align-items-center">
                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise
                        className="arrowClock"
                        title={t("refresh")}
                        onClick={() => reloadHandler()}
                      />
                    )}
                  </div>

                  <div>
                    <ReactToPrint
                      documentTitle="Staff Report"
                      trigger={() => (
                        <PrinterFill
                          title={t("print")}
                          className="addcutmButton"
                        />
                      )}
                      content={() => componentRef.current}
                    />
                  </div>

                  {["ispOwner", "reseller"].includes(role) && (
                    <div className="addAndSettingIcon">
                      <PersonPlusFill
                        className="addcutmButton"
                        title={t("addStaff")}
                        onClick={() => {
                          setModalStatus("post");
                          setShow(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </FourGround>

            <FourGround>
              <div className="collectorWrapper mt-2 py-2">
                <div className="d-none">
                  <StaffPdf allStaffData={getAllStaffs} ref={componentRef} />
                </div>

                <div className="table-section">
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={getAllStaffs}
                  />
                </div>
              </div>
            </FourGround>
            <Footer />
          </FontColor>
        </div>
      </div>

      {/* component for modal */}

      {/* staff create modal */}
      {modalStatus === "post" && <StaffPost show={show} setShow={setShow} />}

      {/* staff edit modal */}
      {modalStatus === "edit" && (
        <StaffEdit show={show} setShow={setShow} staffId={staffId} />
      )}

      {/* staff message modal */}
      {modalStatus === "message" && (
        <SingleMessage
          show={show}
          setShow={setShow}
          single={staffSmsId}
          sendCustomer="staff"
        />
      )}

      {/* staff delete modal */}
      {modalStatus === "delete" && (
        <StaffDelete show={show} setShow={setShow} staffId={staffId} />
      )}
    </>
  );
};

export default Staff;
