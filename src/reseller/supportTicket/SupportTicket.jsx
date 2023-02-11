import React, { useEffect, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useTranslation } from "react-i18next";
import Footer from "../../components/admin/footer/Footer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSupportTickets } from "../../features/supportTicketApi";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";
import Table from "../../components/table/Table";
import SupportTicketEdit from "./supportTicketOperation/SupportTicketEdit";
import { getCollector } from "../../features/apiCallReseller";

const SupportTicket = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get reseller id
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  // storing data form redux
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  // loading state
  const [isLoading, setIsLoading] = useState();

  // collector loading
  const [collectorLoading, setCollectorLoading] = useState("");

  // support ticket id state
  const [supportTicketId, setSupportTicketId] = useState();

  // table column
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
        width: "8%",
        Header: "Id",
        accessor: "customer.customerId",
      },
      {
        width: "11%",
        Header: "Name",
        accessor: "customer.name",
      },
      {
        width: "11%",
        Header: " Support Message",
        accessor: "message",
      },

      {
        width: "8%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },

      {
        width: "12%",
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "6%",
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
                  data-bs-target="#resellerSupportTicketEdit"
                  onClick={() => {
                    setSupportTicketId(original?.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  //   onClick={() => {
                  //     handlesupportTicketDeleteId(original?.id);
                  //   }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">{t("delete")}</p>
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

  useEffect(() => {
    getAllSupportTickets(dispatch, resellerId, setIsLoading, "reseller");
    getCollector(dispatch, resellerId, setCollectorLoading);
  }, []);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("supportTicket")}</div>
                    {/* <div className="reloadBtn">
                      {loading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div> */}
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 pt-4 py-2">
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={supportTickets}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <SupportTicketEdit supportTicketId={supportTicketId} />
    </>
  );
};

export default SupportTicket;
