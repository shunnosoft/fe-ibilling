import moment from "moment";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import {
  createSupportTicketApi,
  getAllSupportTicketApi,
} from "../features/getIspOwnerUsersApi";

const SupportTicket = () => {
  const supportForm = useRef();
  const dispatch = useDispatch();
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );
  const paymentHistory = useSelector((state) => state.client.supportTicket);

  const [supportMessage, setSupportMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    if (target.value) {
      setSupportMessage(target.value);
      return setError("");
    }
    setSupportMessage("");
    return setError("Please write yout support message");
  };

  const createSupportTicket = () => {
    if (!supportMessage) {
      supportForm.current.focus();
      return setError("Please write yout support message");
    }
    const data = {
      message: supportMessage,
      ispOwner: userData.ispOwner.id,
      customer: userData.id,
    };
    createSupportTicketApi(data, dispatch, setLoading, setSupportMessage);
  };

  useEffect(() => {
    getAllSupportTicketApi(dispatch, setLoading);
  }, []);

  return (
    <div className="support-ticket-section">
      <p>Ticket Details:</p>
      <div className="packages_info_wraper mw-75 ">
        <p>
          Total Support Receive:{" "}
          <span className="badge bg-secondary">
            {moment(userData?.billingCycle).format("DD-MMM-YYYY")}
          </span>
        </p>
        <p>
          Total Pending: <span className="badge bg-warning text-dark">TK</span>{" "}
        </p>
      </div>
      <h2 className="mt-1">Get Support Ticket</h2>
      <div className="support-message-form">
        <input
          ref={supportForm}
          className="form-control shadow-none"
          type="text"
          onChange={handleChange}
          placeholder="Type Your Problem"
        />

        <button
          onClick={createSupportTicket}
          className="btn btn-sm btn-success ms-2 shadow-none"
        >
          {loading ? <Loader /> : "Get Support"}
        </button>
      </div>
      {error && !supportMessage && <p className="text-warning">{error}</p>}
      <div className="support-ticket-table">
        <div className="support-table-data">
          <div className="support-count">#</div>
          <div className="support-message ">Support Message</div>
          <div className="support-status "> Status</div>
          <div className="support-apply-date">Support Applied</div>
          <div className="support-receive-date">Support Receive</div>
        </div>
        {loading ? (
          <div className="text-center mt-5">
            <Loader />
          </div>
        ) : (
          paymentHistory.map((item, index) => (
            <div className="support-table-data mt-2">
              <div className="support-count">{index + 1}. </div>

              <div className="support-message"> {item.message}</div>
              <div className="support-status">
                <span
                  className={`badge bg-${
                    (item.status === "pending" && "danger") ||
                    (item.status === "processed" && "secondary") ||
                    (item.status === "complete" && "success")
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="support-apply-date">
                {" "}
                <span className="badge bg-secondary">
                  {moment(item.createdAt).format("MMM-DD-YYYY")}
                </span>
              </div>
              <div className="support-receive-date">
                {" "}
                <span className="badge bg-success">20/10/3000</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportTicket;
