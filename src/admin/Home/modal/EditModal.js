import React from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DetailsForm from "./DetailsForm";
import BkashForm from "./BkashForm";

// import { divisions } from "../../../bdAddress/bd-divisions.json";
// import { districts } from "../../../bdAddress/bd-districts.json";
// import { thana } from "../../../bdAddress/bd-upazilas.json";

const ISPOwnerEditModal = ({ ownerId }) => {
  const { t } = useTranslation();

  //get all isp owner
  //get editable owner
  const data = useSelector((state) => state.admin?.ispOwners);
  const ispOwner = data.find((item) => item.id === ownerId);

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="clientEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title" id="exampleModalLabel">
                <div className="d-flex">
                  <h5>
                    Id: <span className="text-success"> {ispOwner?.id} </span>
                  </h5>
                  <h5 className="ms-5">
                    Mobile:
                    <span className="text-success"> {ispOwner?.mobile}</span>
                  </h5>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Tabs
                defaultActiveKey={"Owner"}
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Owner" title={t("ISPOwner")}>
                  <DetailsForm ispOwner={ispOwner} />
                </Tab>
                <Tab eventKey="bkash" title={t("bkash")}>
                  <BkashForm ispOwner={ispOwner} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISPOwnerEditModal;
