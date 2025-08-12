import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DetailsForm from "./DetailsForm";
import PaymentGateway from "./PaymentGateway";
import { getSingleIspOwner } from "../../../features/apiCallAdmin";
import TdLoader from "../../../components/common/TdLoader";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const ISPOwnerEditModal = ({ show, setShow, ownerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // isLoading state
  const [isLoading, setIsLoading] = useState(false);

  //get single ispOwner
  const ispData = useSelector((state) => state.admin?.singleIspOwner);

  useEffect(() => {
    show && getSingleIspOwner(ownerId, dispatch, setIsLoading);
  }, [show]);

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="xl"
        header={
          <div className="d-flex">
            <h5>
              iBilling Id:
              <span className="text-success"> {ispData?.netFeeId} </span>
            </h5>
            <h5 className="ms-3">
              Id: <span className="text-success"> {ispData?.id} </span>
            </h5>
            <h5 className="ms-3">
              Mobile:
              <span className="text-success"> {ispData?.mobile}</span>
            </h5>
            <h5 className="ms-3">
              Company:
              <span className="text-success"> {ispData?.company}</span>
            </h5>
            <h5 className="ms-3">
              Name:
              <span className="text-success"> {ispData?.name}</span>
            </h5>
          </div>
        }
      >
        <Tabs
          defaultActiveKey={"Owner"}
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Owner" title="ISP Owner">
            {isLoading ? (
              <TdLoader />
            ) : (
              <DetailsForm setShow={setShow} ispOwner={ispData} />
            )}
          </Tab>

          <Tab eventKey="paymentGateway" title="Payment Gateway">
            <PaymentGateway setShow={setShow} ispOwner={ispData} />
          </Tab>
        </Tabs>
      </ComponentCustomModal>
    </>
  );
};

export default ISPOwnerEditModal;
