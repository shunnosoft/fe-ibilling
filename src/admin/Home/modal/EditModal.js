import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DetailsForm from "./DetailsForm";
import PaymentGateway from "./PaymentGateway";
import { getSingleIspOwner } from "../../../features/apiCallAdmin";
import TdLoader from "../../../components/common/TdLoader";

// import { divisions } from "../../../bdAddress/bd-divisions.json";
// import { districts } from "../../../bdAddress/bd-districts.json";
// import { thana } from "../../../bdAddress/bd-upazilas.json";

const ISPOwnerEditModal = ({ ownerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // isLoading state
  const [isLoading, setIsLoading] = useState(false);

  //get single ispOwner
  const ispData = useSelector((state) => state.admin?.singleIspOwner);

  useEffect(() => {
    if (ownerId) {
      getSingleIspOwner(ownerId, dispatch, setIsLoading);
    }
  }, [ownerId]);

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
                    Id: <span className="text-success"> {ispData?.id} </span>
                  </h5>
                  <h5 className="ms-5">
                    Mobile:
                    <span className="text-success"> {ispData?.mobile}</span>
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
                <Tab eventKey="Owner" title="ISP Owner">
                  {isLoading ? (
                    <TdLoader />
                  ) : (
                    <DetailsForm ispOwner={ispData} />
                  )}
                </Tab>
                <Tab eventKey="paymentGateway" title="Payment Gateway">
                  <PaymentGateway ispOwner={ispData} />
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
