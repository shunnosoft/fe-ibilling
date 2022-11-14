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
  editSupportTicketsApi,
  getAllSupportTickets,
} from "../../features/supportTicketApi";
import { useSelector } from "react-redux";
import { PenFill, ThreeDots } from "react-bootstrap-icons";

const SupportTicket = () => {
  const { t } = useTranslation();

  // declare state
  const [isLoading, setIsLoading] = useState(false);
  const [supportTicketId, setSupportTicketId] = useState("");
  const [supportTicketStatusValue, setSupportTicketStatusValue] = useState("");
  console.log(supportTicketStatusValue);

  // storing data form redux
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );
  console.log(supportTickets);

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("first");
    getAllSupportTickets(dispatch, ispOwner, setIsLoading);
  }, []);

  const getSupportId = (id) => {
    setSupportTicketId(id);
  };

  const handleSupportTicketStatus = (e) => {
    let value = e.target.value;
    setSupportTicketStatusValue(value);
  };

  const SupportTicketStatusSubmit = (e) => {
    e.preventDefault();

    editSupportTicketsApi(dispatch, supportTicketStatusValue, supportTicketId);
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
        width: "11%",
        Header: " Support Message",
        accessor: "message",
      },

      {
        width: "8%",
        Header: t("status"),
        accessor: "status",
      },

      {
        width: "12%",
        Header: "Support Applied",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      // {
      //   width: "6%",
      //   Header: () => <div className="text-center">{t("action")}</div>,
      //   id: "option",

      //   Cell: ({ row: { original } }) => (
      //     <div
      //       style={{
      //         display: "flex",
      //         alignItems: "center",
      //         justifyContent: "center",
      //       }}
      //     >
      //       <div className="dropdown">
      //         <ThreeDots
      //           className="dropdown-toggle ActionDots"
      //           id="areaDropdown"
      //           type="button"
      //           data-bs-toggle="dropdown"
      //           aria-expanded="false"
      //         />
      //         <ul className="dropdown-menu" aria-labelledby="customerDrop">
      //           <li
      //             data-bs-toggle="modal"
      //             data-bs-target="#exampleModal"
      //             onClick={() => {
      //               getSupportId(original?.id);
      //             }}
      //           >
      //             <div className="dropdown-item">
      //               <div className="customerAction">
      //                 <PenFill />
      //                 <p className="actionP">{t("edit")}</p>
      //               </div>
      //             </div>
      //           </li>
      //         </ul>
      //       </div>
      //     </div>
      //   ),
      // },
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
                    <div>Support Ticket</div>
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
              <FourGround>
                <div className="collectorWrapper mt-2 py-2"></div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Support Status
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <select
                class="form-select"
                aria-label="Default select example"
                onChange={handleSupportTicketStatus}
              >
                <option selected>Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancle
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={SupportTicketStatusSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportTicket;
