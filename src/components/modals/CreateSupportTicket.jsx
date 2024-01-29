import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// internal import
import {
  createSupportTicketApi,
  getTicketCategoryApi,
} from "../../features/supportTicketApi";
import Loader from "../common/Loader";
import ComponentCustomModal from "../common/customModal/ComponentCustomModal";

const CreateSupportTicket = ({
  show,
  setShow,
  customer,
  collectors,
  manager,
  ispOwner,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user role form redux
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get user data form redux store
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
    if (!supportTicket.message) {
      alert("Enter Message");
      return;
    }

    if (!supportTicket.ticketType) {
      alert("Enter Ticket Type");
      return;
    }

    const data = {
      message: supportTicket.message,
      ticketType: supportTicket.ticketType,
      ticketCategory: supportTicket.ticketCategory,
      assignedStaff: supportTicket.assignPerson,
      customer: customer.id,
    };

    if (role === "ispOwner") data.ispOwner = ispOwner;

    if (role === "manager") {
      data.manager = userData.id;
      data.ispOwner = ispOwner;
    }

    //IspOwner Collector
    if (role === "collector" && !userData.reseller) {
      data.collector = userData.id;
      data.ispOwner = ispOwner;
    }

    //Reseller Collector
    if (role === "collector" && userData.reseller) {
      data.collector = userData.id;
      data.reseller = userData.reseller;
    }

    if (role !== "collector" && !data.assignedStaff) {
      alert("Select Staff");
      return;
    }
    if (role === "collector") delete data.assignedStaff;

    if (!supportTicket.ticketCategory) {
      delete data.ticketCategory;
    }

    createSupportTicketApi(dispatch, data, setLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("createSupportTicket")}
      >
        <div className="displayGrid">
          <div>
            <label className="text-secondary">{t("enterSupportText")}</label>
            <input
              className="form-control mw-100"
              type="text"
              name="message"
              onChange={onChangeHandler}
              value={supportTicket.message}
            />
          </div>

          {role !== "collector" && (
            <div>
              <label className="text-secondary">{t("selectStaff")}</label>
              <select
                name="assignPerson"
                onChange={onChangeHandler}
                className="form-select mt-0 mw-100"
              >
                <option value="">...</option>
                {role === "ispOwner" &&
                  manager &&
                  manager?.map((man) => (
                    <option value={man?.user}>{man.name} (Manager)</option>
                  ))}

                {collectors &&
                  collectors.map((item) => (
                    <option value={item?.user}>{item.name}</option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-secondary">{t("selectTicketType")}</label>

            <select
              name="ticketType"
              onChange={onChangeHandler}
              className="form-select mt-0 mw-100"
            >
              <option value="">...</option>
              <option value="high">{t("High")}</option>
              <option value="medium">{t("Medium")}</option>
              <option value="low">{t("Low")}</option>
            </select>
          </div>

          <div>
            <label className="text-secondary">
              {t("selectTicketCategory")}
            </label>

            <select
              name="ticketCategory"
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

          <button
            className="btn btn-success ms-auto shadow-none mt-3"
            onClick={createSupportTicketHandler}
          >
            {loading ? <Loader /> : t("submit")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default CreateSupportTicket;
