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

const Ticket = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get support ticket
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  console.log(supportTickets);

  //get ispOwner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //get all ticket Category
  const ticketCategory = useSelector(
    (state) => state.supportTicket.ticketCategory
  );

  // declare state
  const [isLoading, setIsLoading] = useState(false);
  const [supportTicketId, setSupportTicketId] = useState("");
  const [deleteTicketId, setDeleteTicketId] = useState("");
  const [allCollector, setAllCollector] = useState([]);
  const [mainData, setMainData] = useState(supportTickets);
  const [status, setStatus] = useState("");
  const [ticketType, setTicketType] = useState("");

  //get all support ticket
  useEffect(() => {
    getAllSupportTickets(dispatch, ispOwner, setIsLoading);
  }, []);

  //set main data
  useEffect(() => {
    setMainData(supportTickets);
  }, [supportTickets]);

  //getting all collector
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

  //table columns
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
        width: "11%",
        Header: t("ticketType"),
        accessor: "ticketType",
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

  //filter handler
  const filterHandler = () => {
    let filterData = [...supportTickets];

    if (status) {
      filterData = filterData.filter((temp) => temp.status === status);
    }

    if (ticketType) {
      filterData = filterData.filter((temp) => temp.ticketType === ticketType);
    }

    setMainData(filterData);
  };

  return (
    <>
      <div className="selectFilteringg">
        <select
          className="form-select"
          //onChange={(e) => setCollectedBy(e.target.value)}
        >
          <option value="" defaultValue>
            {t("all collector")}
          </option>

          <option value="other">Other</option>
        </select>

        <select
          className="form-select mx-2"
          onChange={(e) => setTicketType(e.target.value)}
        >
          <option value="" defaultValue>
            {t("ticketType")}
          </option>

          <option value="high">{t("High")}</option>
          <option value="medium"> {t("Medium")} </option>
          <option value="low"> {t("Low")} </option>
        </select>
        <select
          className="form-select"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="" selected>
            {t("status")}
          </option>

          <option value="processing">{t("Processing")}</option>
          <option value="completed">{t("Completed")}</option>
        </select>

        <div>
          <button
            className="btn btn-outline-primary w-110 mt-2 ms-2"
            type="button"
            onClick={filterHandler}
          >
            {t("filter")}
          </button>
        </div>
      </div>
      <Table
        isLoading={isLoading}
        //customComponent={customComponent}
        columns={columns}
        data={mainData}
      ></Table>

      {/* Edit Modal Start */}
      <SupportTicketEdit
        ticketEditId={supportTicketId}
        allCollector={allCollector}
      />

      {/* Delete Modal Start */}
      <SupportTicketDelete supportTicketDeleteID={deleteTicketId} />
    </>
  );
};

export default Ticket;
