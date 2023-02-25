import React, { useMemo } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import Table from "../../components/table/Table";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllSupportTickets } from "../../features/supportTicketApi";
import { useSelector } from "react-redux";
import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";
import SupportTicketEdit from "./modal/SupportTicketEdit";
import SupportTicketDelete from "./modal/SupportTicketDelete";
import { badge } from "../../components/common/Utils";
import apiLink from "../../api/apiLink";

const SupportTicket = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // storing data form redux
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // declare state
  const [isLoading, setIsLoading] = useState(false);
  const [supportTicketId, setSupportTicketId] = useState("");
  const [deleteTicketId, setDeleteTicketId] = useState("");
  const [allCollector, setAllCollector] = useState([]);

  useEffect(() => {
    getAllSupportTickets(dispatch, ispOwner, setIsLoading);
  }, []);

  useEffect(async () => {
    const res = await apiLink.get(`/ispOwner/collector/${ispOwner}`);
    setAllCollector([...res.data]);
  }, []);

  // handle edit function
  const handlesupportTicketEditId = (ticketId) => {
    setSupportTicketId(ticketId);
  };

  // handle delete function
  const handlesupportTicketDeleteId = (ticketId) => {
    setDeleteTicketId(ticketId);
  };

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
        Header: t("customerId"),
        accessor: "customer.customerId",
      },
      {
        width: "11%",
        Header: t("name"),
        accessor: "customer.name",
      },
      {
        width: "11%",
        Header: t("supportMessage"),
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
        Header: t("createdAt"),
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
                  data-bs-target="#editModal"
                  onClick={() => {
                    handlesupportTicketEditId(original?.id);
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
                  onClick={() => {
                    handlesupportTicketDeleteId(original?.id);
                  }}
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
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("supportTicket")}</div>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      // customComponent={customComponent}
                      columns={columns}
                      data={supportTickets}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              {/* <FourGround>
                <div className="collectorWrapper mt-2 py-2"></div>
              </FourGround> */}
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* Edit Modal Start */}
      <SupportTicketEdit
        ticketEditId={supportTicketId}
        allCollector={allCollector}
      />
      {/* Edit Modal End */}

      {/* Delete Modal Start */}

      <SupportTicketDelete supportTicketDeleteID={deleteTicketId} />

      {/* Delete Modal end */}
    </>
  );
};

export default SupportTicket;
