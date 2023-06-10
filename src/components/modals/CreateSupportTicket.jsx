import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  createSupportTicketApi,
  getTicketCategoryApi,
} from "../../features/supportTicketApi";
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

  //get ticket category
  const allTicketCategory = useSelector(
    (state) => state.supportTicket.ticketCategory
  );

  const [supportTicket, setSupportTicket] = useState({
    message: "",
    assignPerson: "",
    ticketType: "",
    ticketCategory: "",
  });

  // Loading state
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ticket category api call
  useEffect(() => {
    getTicketCategoryApi(dispatch, ispOwner, setIsLoading);
  }, [ispOwner]);

  const onChangeHandler = ({ target: { name, value } }) => {
    setSupportTicket({ ...supportTicket, [name]: value });
  };

  const createSupportTicketHandler = () => {
    const assignedPerson = supportTicket.assignPerson.split("-");
    const data = {
      message: supportTicket.message,
      ticketType: supportTicket.ticketType,
      ticketCategory: supportTicket.ticketCategory,
      ...(assignedPerson[1] === "manager"
        ? { manager: assignedPerson[0] }
        : { collector: assignedPerson[0] }),
      ...(customer?.reseller ? { reseller } : { ispOwner }),
      customer: customer.id,
      ...(role === "collector" && { collector: userData.id }),
    };

    if (!supportTicket.ticketCategory) {
      delete data.ticketCategory;
    }

    if (!supportTicket.ticketType) {
      delete data.ticketType;
    }

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
                <label className="text-secondary" htmlFor="message">
                  {t("enterSupportText")}
                </label>
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
                <>
                  <div className="w-100 mt-3">
                    <label className="text-secondary" htmlFor="assignedPerson">
                      {t("selectStaff")}
                    </label>
                    <select
                      name="assignPerson"
                      id="assignPerson"
                      onChange={onChangeHandler}
                      className="form-select mt-0 mw-100"
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

                  <div className="w-100 mt-3">
                    <label className="text-secondary" htmlFor="ticketType">
                      {t("selectTicketType")}
                    </label>
                    <select
                      name="ticketType"
                      id="ticketType"
                      onChange={onChangeHandler}
                      className="form-select mt-0 mw-100"
                    >
                      <option value="">...</option>
                      <option value="high">{t("High")}</option>
                      <option value="medium">{t("Medium")}</option>
                      <option value="low">{t("Low")}</option>
                    </select>
                  </div>

                  <div className="w-100 mt-3">
                    <label className="text-secondary" htmlFor="ticketCategory">
                      {t("selectTicketCategory")}
                    </label>
                    <select
                      name="ticketCategory"
                      id="ticketCategory"
                      onChange={onChangeHandler}
                      className="form-select mt-0 mw-100"
                    >
                      <option value="">...</option>
                      {allTicketCategory &&
                        allTicketCategory.map((item) => (
                          <option value={item?.id}>{item.name}</option>
                        ))}
                    </select>
                  </div>
                </>
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
