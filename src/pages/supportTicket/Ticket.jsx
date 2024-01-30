import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal import
import Table from "../../components/table/Table";
import { getAllSupportTickets } from "../../features/supportTicketApi";
import SupportTicketEdit from "./modal/SupportTicketEdit";
import SupportTicketDelete from "./modal/SupportTicketDelete";
import { badge } from "../../components/common/Utils";
import apiLink from "../../api/apiLink";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";

const Ticket = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId } = useISPowner();

  // get support ticket
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  // get manager
  const manager = useSelector((state) => state.manager?.manager);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

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
  const [category, setCategory] = useState("");
  const [staff, setStaff] = useState("");

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  //get all support ticket
  useEffect(() => {
    getAllSupportTickets(dispatch, ispOwnerId, setIsLoading);
    getOwnerUsers(dispatch, ispOwnerId);
  }, []);

  //set main data
  useEffect(() => {
    setMainData(supportTickets);
  }, [supportTickets]);

  //getting all collector
  useEffect(async () => {
    const res = await apiLink.get(`/ispOwner/collector/${ispOwnerId}`);
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

  //Category Name finding function
  const CategoryNameCalculation = (val) => {
    if (val) {
      const temp = ticketCategory?.find((cat) => cat?.id === val);

      return temp?.name || "";
    } else return "";
  };

  //table columns
  const columns = useMemo(
    () => [
      {
        width: "5%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "5%",
        Header: t("ticketId"),
        accessor: "ticketId",
      },
      {
        width: "12%",
        Header: t("name"),
        accessor: "customer.name",
      },
      {
        width: "18%",
        Header: t("message"),
        accessor: "message",
      },
      {
        width: "12%",
        Header: t("staff"),
        accessor: "assignedStaff",
        Cell: ({ cell: { value } }) => {
          const performer = ownerUsers?.find((item) => item[value]);

          return (
            <div>
              {performer &&
                performer[value].name + "(" + performer[value].role + ")"}
            </div>
          );
        },
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
        width: "8%",
        Header: t("type"),
        accessor: "ticketType",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },

      {
        width: "15%",
        Header: t("category"),
        accessor: "ticketCategory",
        Cell: ({ cell: { value } }) => {
          return CategoryNameCalculation(value);
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
          <div className="d-flex justify-content-center align-items-center">
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
                  onClick={() => {
                    handlesupportTicketEditId(original?.id);
                    setModalStatus("ticketEdit");
                    setShow(true);
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
                  onClick={() => {
                    handlesupportTicketDeleteId(original?.id);
                    setModalStatus("delete");
                    setShow(true);
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
    [t, ticketCategory, ownerUsers]
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
    if (category) {
      filterData = filterData.filter(
        (temp) => temp?.ticketCategory === category
      );
    }

    if (staff) {
      filterData = filterData.filter((temp) => temp?.assignedStaff === staff);
    }

    setMainData(filterData);
  };

  return (
    <>
      <div className="selectFilteringg">
        <select
          className="form-select"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" defaultValue>
            {t("ticketCategory")}
          </option>
          {ticketCategory.map((cat) => (
            <option value={cat?.id}>{cat?.name}</option>
          ))}
        </select>

        <select
          className="form-select mx-2"
          onChange={(e) => setStaff(e.target.value)}
        >
          <option value="" defaultValue>
            {t("staff")}
          </option>

          {role === "ispOwner" &&
            manager &&
            manager?.map((man) => (
              <option value={man?.user}>{man?.name} (Manager)</option>
            ))}

          {allCollector?.map((collector) => {
            return (
              <option value={collector?.user}>
                {collector?.name} (collector)
              </option>
            );
          })}
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
          <option value="pending">{t("Pending")}</option>
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
      <Table isLoading={isLoading} columns={columns} data={mainData}></Table>

      {/* Edit Modal Start */}
      {modalStatus === "ticketEdit" && (
        <SupportTicketEdit
          show={show}
          setShow={setShow}
          ticketEditId={supportTicketId}
          allCollector={allCollector}
        />
      )}

      {/* Delete Modal Start */}
      {modalStatus === "delete" && (
        <SupportTicketDelete
          show={show}
          setShow={setShow}
          supportTicketDeleteID={deleteTicketId}
        />
      )}
    </>
  );
};

export default Ticket;
