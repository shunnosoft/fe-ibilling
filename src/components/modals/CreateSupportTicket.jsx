import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSupportTicketApi } from "../../features/supportTicketApi";
import Loader from "../common/Loader";

const CreateSupportTicket = ({
  customer,
  collectors,
  manager,
  ispOwner,
  reseller,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.persistedReducer.auth?.role);
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const [supportTicket, setSupportTicket] = useState({
    message: "",
    assignPerson: "",
  });
  const [loading, setLoading] = useState(false);
  const onChangeHandler = ({ target: { name, value } }) => {
    setSupportTicket({ ...supportTicket, [name]: value });
  };

  const createSupportTicketHandler = () => {
    const assignedPerson = supportTicket.assignPerson.split("-");
    const data = {
      message: supportTicket.message,
      ...(assignedPerson[1] === "manager"
        ? { manager: assignedPerson[0] }
        : { collector: assignedPerson[0] }),
      ...(customer?.reseller ? { reseller } : { ispOwner }),
      customer: customer.id,
      ...(role === "collector" && { collector: userData.id }),
    };
    createSupportTicketApi(dispatch, data, setLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="createSupportTicket"
      tabIndex="-1"
      aria-labelledby="createSupportTicket"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="createSupportTicket">
              {t("createSupportTicket")}
            </h4>
            <button
              type="button"
              className="btn-close"
              id="closeAddManagerBtn"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="input-group mb-3">
              <div className="w-100">
                <label htmlFor="message">Enter support text</label>
                <input
                  className="form-control mw-100"
                  type="text"
                  name="message"
                  id="message"
                  onChange={onChangeHandler}
                  value={supportTicket.message}
                />
              </div>
              {role !== "collector" && (
                <div className="w-100 mt-3">
                  <label htmlFor="assignedPerson">Select Staff</label>
                  <select
                    name="assignPerson"
                    id="assignPerson"
                    onChange={onChangeHandler}
                    className="form-select mw-100"
                  >
                    <option value="">...</option>
                    {role === "ispOwner" && (
                      <option value={`${manager?.id}-manager`}>
                        {manager.name}(Manager)
                      </option>
                    )}

                    {collectors &&
                      collectors.map((item) => (
                        <option value={`${item?.id}-collector`}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <button
                className="btn btn-success ms-auto shadow-none mt-3"
                onClick={createSupportTicketHandler}
              >
                {loading ? <Loader /> : t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSupportTicket;
