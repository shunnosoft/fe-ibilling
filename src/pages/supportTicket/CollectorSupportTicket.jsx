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
import {
  getCollectorApi,
  getTicketCategoryApi,
} from "../../features/supportTicketApi";
import { useSelector } from "react-redux";
import { PenFill, ThreeDots } from "react-bootstrap-icons";
import { badge } from "../../components/common/Utils";
import CollectorSupportTicketEdit from "./modal/CollectorSupportTicketEdit";

const CollectorSupportTicket = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // storing data form redux
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  //get all ticket Category
  const ticketCategory = useSelector(
    (state) => state.supportTicket.ticketCategory
  );

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const collectorId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.collector?.user
  );

  // declare state
  const [isLoading, setIsLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [supportTicketId, setSupportTicketId] = useState("");
  const [mainData, setMainData] = useState(supportTickets);
  const [status, setStatus] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [category, setCategory] = useState("");

  //set main data
  useEffect(() => {
    setMainData(supportTickets);
  }, [supportTickets]);

  useEffect(() => {
    getCollectorApi(dispatch, ispOwner, collectorId, setIsLoading);
    getTicketCategoryApi(dispatch, ispOwner, setCategoryLoading);
  }, []);

  // handle edit function
  const handlesupportTicketEditId = (ticketId) => {
    setSupportTicketId(ticketId);
  };

  //Category Name finding function
  const CategoryNameCalculation = (val) => {
    if (val) {
      const temp = ticketCategory?.find((cat) => cat?.id === val);

      return temp?.name || "";
    } else return "";
  };

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

    setMainData(filterData);
  };

  const columns = useMemo(
    () => [
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
        width: "8%",
        Header: t("type"),
        accessor: "ticketType",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },

      {
        width: "17%",
        Header: t("category"),
        accessor: "ticketCategory",
        Cell: ({ cell: { value } }) => {
          return CategoryNameCalculation(value);
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
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t, ticketCategory]
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
                    <div>Support Ticket</div>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
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
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={mainData}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* Edit Modal Start */}
      <CollectorSupportTicketEdit supportTicketId={supportTicketId} />
    </>
  );
};

export default CollectorSupportTicket;
