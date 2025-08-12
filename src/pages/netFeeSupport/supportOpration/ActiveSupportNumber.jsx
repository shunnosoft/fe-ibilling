import React from "react";
import useISPowner from "../../../hooks/useISPOwner";
import { useSelector } from "react-redux";
import { Clock, Dash, Telephone, Whatsapp } from "react-bootstrap-icons";

const ActiveSupportNumber = () => {
  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerData } = useISPowner();

  // iBilling support Numbers
  const supportNumbers = useSelector(
    (state) => state.netFeeSupport?.supportCall
  );

  return (
    <>
      {["ispOwner", "manager"].includes(role) ? (
        <div className="support">
          <h4 className="support_title p-1">SUPPORT TEAM</h4>

          {supportNumbers?.map((val) => (
            <div className="support_team shadow-sm bg-body rounded gap-2">
              <div className="d-flex align-items-center">
                <img
                  src="./assets/img/noAvater.jpg"
                  alt=""
                  className="support_person"
                />

                <span className="support_info">
                  <p className="fw-bold">{val.name}</p>
                  <p>{val.mobile1}</p>
                </span>
              </div>

              <div className="d-flex flex-column justify-content-center align-items-end gap-1">
                <span className="d-flex align-items-center gap-2">
                  <Clock className="support_icon text-primary" />
                  <div className="d-flex align-items-center">
                    <p className="fw-bold fs-6 text-success">{val.start}</p>
                    <Dash />
                    <p className="fw-bold fs-6 text-danger">{val.end}</p>
                  </div>
                </span>

                <span>
                  <Telephone className="support_icon text-primary me-3" />
                  <Whatsapp className="support_icon text-success" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="support">
          <h4 className="support_title p-1">CONTACT YOUR ADMIN</h4>

          <div className="support_team shadow-sm bg-body rounded gap-2">
            <div className="d-flex align-items-center">
              <img
                src="./assets/img/noAvater.jpg"
                alt=""
                className="support_person"
              />

              <span className="support_info">
                <p className="fw-bold ">{ispOwnerData.name}</p>
                <p>{ispOwnerData.mobile}</p>
              </span>
            </div>

            <div className="support_media">
              <Telephone className="support_icon text-primary me-3" />
              <Whatsapp className="support_icon text-success" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveSupportNumber;
